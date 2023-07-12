const { ClarifaiStub, grpc } = require("clarifai-nodejs-grpc");

const stub = ClarifaiStub.grpc();

// This will be used by every Clarifai endpoint call
const metadata = new grpc.Metadata();
metadata.set("authorization", "Key " + "95dca3dcce2548fa987c29dd32af7cdb");

const handleApiCall = (req, res) => {    
    stub.PostModelOutputs(
        {
            user_app_id: {
                "user_id": "kabdullah6",
                "app_id": "facerecognizer"
            },
            model_id: "face-detection",
            // version_id: "aa7f35c01e0642fda5cf400f543e7c40",  // This is optional. Defaults to the latest model version
            inputs: [
                { data: { image: { url: req.body.input } } }
            ]
        },
        metadata,
        (err, response) => {
            if (err) {
                throw new Error(err);
            }

            if (response.status.code !== 10000) {
                throw new Error("Post model outputs failed, status: " + response.status.description);
            }

            // Since we have one input, one output will exist here.
            const output = response.outputs[0];

            console.log("Predicted concepts:");
            for (const concept of output.data.concepts) {
                console.log(concept.name + " " + concept.value);
            }
            res.json(response);
        }
    );
} 

const handleImage = (req, res, db) => {    
    const { id } = req.body;
    	db('users').where('id', '=', id)
      .increment('entries', 1)
      .returning('entries')
      .then(entries => {
      	res.json(entries[0].entries);
      })
      .catch(err => res.status(400).json('unable to get entries'))
} 

module.exports = { 
    handleImage: handleImage,
    handleApiCall: handleApiCall
};