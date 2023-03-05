import express from 'express';
import path from 'path';
import cors from 'cors';
import mongoose from 'mongoose';
import dialogflow from 'dialogflow'
import { WebhookClient } from 'dialogflow-fulfillment'

const app = express()
app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
    res.sendStatus(200);
});

const pluck = (arr) => {
    const min = 0;
    const max = arr.length - 1;
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;

    return arr[randomNumber]
}

app.get("/ping", (req, res) => {
    res.send("ping back");
})

const port = process.env.PORT || 5001;


/*---------------------APIs--------------------------*/

app.post('/webhook', async (req, res) => {

    try {
        const body = req.body;

        const intentName = body.queryResult.intent.displayName
        const params = body.queryResult.parameters

        console.log(intentName, params)

        switch (intentName) {
            case "Welcome":
                {
                    res.send({
                        "fulfillmentMessages": [
                            {
                                "text": {
                                    "text": [
                                        "Welcome to the Cake Shop! How can I help you?"
                                    ]
                                }
                            }
                        ]
                    })
                    break;
                }
            case "OrderCake":
                {
                    let flavor = params.CakeFlavor
                    let size = params.CakeSize
                    let quantity = params.CakeQuantity

                    console.log('flavor: ', flavor)
                    console.log('size: ', size)
                    console.log('quantity: ', quantity)

                    if (!size) {
                        res.send({
                            "fulfillmentMessages": [
                                {
                                    "text": {
                                        "text": [
                                            "What size would you like your cake to be? Please specify in pounds (e.g. 1 pound, 2.5 pounds)."
                                        ]
                                    }
                                }
                            ]
                        })
                    }
                    else if (!flavor) {
                        res.send({
                            "fulfillmentMessages": [
                                {
                                    "text": {
                                        "text": [
                                            "What flavor would you like your cake to be?"
                                        ]
                                    }
                                }
                            ]
                        })
                    }
                    else if (quantity == undefined) {
                        quantity = 1
                    }

                    res.send({
                        "fulfillmentMessages": [
                            {
                                "text": {
                                    "text": [
                                        `You ordered ${quantity} ${flavor} cake of size ${size.amount} pound.`
                                    ]
                                }
                            }
                        ]
                    })

                    break;
                }
            default: {
                res.send({
                    "fulfillmentMessages": [
                        {
                            "text": {
                                "text": [
                                    "something is wrong in server, please try again"
                                ]
                            }
                        }
                    ]
                })
            }
        }

    }
    catch (err) {
        console.log(err);
        res.send({
            "fulfillmentMessages": [
                {
                    "text": {
                        "text": [
                            "something is wrong in server, please try again"
                        ]
                    }
                }
            ]
        })
    }

});


/*---------------------Static Files--------------------------*/

const __dirname = path.resolve();
app.get('/', express.static(path.join(__dirname, "/Web/index.html")));
app.use('/', express.static(path.join(__dirname, "/Web")));

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
