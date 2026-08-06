import json
from datetime import datetime, timezone

import boto3
from botocore.exceptions import ClientError


dynamodb = boto3.resource(
    "dynamodb",
    region_name="ap-southeast-1"
)

table = dynamodb.Table("CloudMenuOrders")


def create_response(status_code, body):
    return {
        "statusCode": status_code,
        "headers": {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods": "GET,POST,PUT,OPTIONS",
            "Content-Type": "application/json"
        },
        "body": json.dumps(
            body,
            ensure_ascii=False
        )
    }


def lambda_handler(event, context):
    try:
        print(
            "EVENT:",
            json.dumps(
                event,
                ensure_ascii=False
            )
        )

        path_parameters = (
            event.get("pathParameters")
            or {}
        )

        order_id = path_parameters.get(
            "orderId"
        )

        if not order_id:
            return create_response(
                400,
                {
                    "success": False,
                    "message": "Missing orderId"
                }
            )

        raw_body = (
            event.get("body")
            or "{}"
        )

        if isinstance(raw_body, str):
            body = json.loads(raw_body)
        elif isinstance(raw_body, dict):
            body = raw_body
        else:
            return create_response(
                400,
                {
                    "success": False,
                    "message": "Invalid request body"
                }
            )

        new_status = body.get("status")

        allowed_statuses = {
            "PENDING",
            "PREPARING",
            "COMPLETED"
        }

        if new_status not in allowed_statuses:
            return create_response(
                400,
                {
                    "success": False,
                    "message": "Invalid order status"
                }
            )

        updated_at = datetime.now(
            timezone.utc
        ).isoformat()

        expression_attribute_names = {
            "#status": "status"
        }

        expression_attribute_values = {
            ":status": new_status,
            ":updatedAt": updated_at
        }

        update_expression = (
            "SET #status = :status, "
            "updatedAt = :updatedAt"
        )

        completed_at = None

        if new_status == "COMPLETED":
            completed_at = (
                body.get("completedAt")
                or updated_at
            )

            update_expression += (
                ", completedAt = :completedAt"
            )

            expression_attribute_values[
                ":completedAt"
            ] = completed_at

        response = table.update_item(
            Key={
                "orderId": order_id
            },
            UpdateExpression=update_expression,
            ExpressionAttributeNames=(
                expression_attribute_names
            ),
            ExpressionAttributeValues=(
                expression_attribute_values
            ),
            ConditionExpression=(
                "attribute_exists(orderId)"
            ),
            ReturnValues="ALL_NEW"
        )

        updated_order = response.get(
            "Attributes",
            {}
        )

        response_body = {
            "success": True,
            "message": (
                "Order status updated"
            ),
            "orderId": order_id,
            "status": new_status,
            "updatedAt": updated_at,
            "order": updated_order
        }

        if completed_at:
            response_body["completedAt"] = (
                completed_at
            )

        return create_response(
            200,
            response_body
        )

    except json.JSONDecodeError:
        return create_response(
            400,
            {
                "success": False,
                "message": "Invalid JSON body"
            }
        )

    except ClientError as error:
        error_code = (
            error.response
            .get("Error", {})
            .get("Code")
        )

        if (
            error_code
            == "ConditionalCheckFailedException"
        ):
            return create_response(
                404,
                {
                    "success": False,
                    "message": "Order not found"
                }
            )

        print(
            "DYNAMODB ERROR:",
            repr(error)
        )

        return create_response(
            500,
            {
                "success": False,
                "message": "DynamoDB update failed"
            }
        )

    except Exception as error:
        print(
            "UPDATE ORDER ERROR:",
            repr(error)
        )

        return create_response(
            500,
            {
                "success": False,
                "message": str(error)
            }
        )