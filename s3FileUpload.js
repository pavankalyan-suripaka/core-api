import AWS from "aws-sdk";
import fs from "fs";

AWS.config.update({
    accessKeyId:process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

const s3= new AWS.S3();

export const uploadFileS3 = (file)=>{
    const fileSteam = fs.createReadStream(file.path);
    const uploadParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `uploads/${Date.now()}_${file.originalname}`,  // Unique path
        Body:fileSteam,
        contentType:file.mimetype,
        ACL:'private' // or 'public-read' depending on requirement
    }

    return s3.upload(uploadParams).promise();
}