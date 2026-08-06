import json
from datetime import datetime, timezone

import boto3

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
            "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
            "Content-Type": "application/json"
        },
        "body": json.dumps(
            body,
            ensure_ascii=False
        )
    }


def lambda_handler(event, context):
    try:
        body = json.loads(
            event.get("body", "{}")
        )

        created_at = (
            body.get("createdAt")
            or datetime.now(
                timezone.utc
            ).isoformat()
        )

        order = {
            "orderId": body["orderId"],
            "tableNumber": body["tableNumber"],

            "status": "PENDING",

            "items": body["items"],

            "totalAmount": body["totalAmount"],

            # ===== NEW =====
            "createdAt": created_at,
            "updatedAt": created_at,
            "completedAt": None
        }

        table.put_item(
            Item=order
        )

        return create_response(
            200,
            {
                "success": True,
                "message": "Order created successfully",
                "orderId": order["orderId"],
                "createdAt": created_at
            }
        )

    except KeyError as error:
        return create_response(
            400,
            {
                "success": False,
                "message": f"Missing field: {error}"
            }
        )

    except Exception as error:
        print(
            "CREATE ORDER ERROR:",
            repr(error)
        )

        return create_response(
            500,
            {
                "success": False,
                "message": str(error)
            }
        )