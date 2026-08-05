import json
import boto3
from datetime import datetime, timezone

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
        "body": json.dumps(body, ensure_ascii=False)
    }


def lambda_handler(event, context):
    try:
        print("EVENT:", json.dumps(event))

        path_parameters = event.get("pathParameters") or {}
        order_id = path_parameters.get("orderId")

        if not order_id:
            return create_response(400, {
                "success": False,
                "message": "Missing orderId"
            })

        raw_body = event.get("body") or "{}"

        if isinstance(raw_body, str):
            body = json.loads(raw_body)
        else:
            body = raw_body

        new_status = body.get("status")

        allowed_statuses = {
            "PENDING",
            "PREPARING",
            "COMPLETED"
        }

        if new_status not in allowed_statuses:
            return create_response(400, {
                "success": False,
                "message": "Invalid order status"
            })

        updated_at = datetime.now(timezone.utc).isoformat()

        table.update_item(
            Key={
                "orderId": order_id
            },
            UpdateExpression=(
                "SET #status = :status, "
                "updatedAt = :updatedAt"
            ),
            ExpressionAttributeNames={
                "#status": "status"
            },
            ExpressionAttributeValues={
                ":status": new_status,
                ":updatedAt": updated_at
            },
            ConditionExpression="attribute_exists(orderId)"
        )

        return create_response(200, {
            "success": True,
            "message": "Order status updated",
            "orderId": order_id,
            "status": new_status,
            "updatedAt": updated_at
        })

    except table.meta.client.exceptions.ConditionalCheckFailedException:
        return create_response(404, {
            "success": False,
            "message": "Order not found"
        })

    except json.JSONDecodeError:
        return create_response(400, {
            "success": False,
            "message": "Invalid JSON body"
        })

    except Exception as error:
        print("UPDATE ORDER ERROR:", repr(error))

        return create_response(500, {
            "success": False,
            "message": str(error)
        })