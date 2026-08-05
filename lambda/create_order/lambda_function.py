import json
import boto3

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table("CloudMenuOrders")


def lambda_handler(event, context):

    body = json.loads(event["body"])

    order = {
        "orderId": body["orderId"],
        "tableNumber": body["tableNumber"],
        "status": "PENDING",
        "items": body["items"],
        "totalAmount": body["totalAmount"]
    }

    table.put_item(Item=order)

    return {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json"
        },
        "body": json.dumps({
            "success": True,
            "message": "Order created successfully",
            "orderId": body["orderId"]
        })
    }