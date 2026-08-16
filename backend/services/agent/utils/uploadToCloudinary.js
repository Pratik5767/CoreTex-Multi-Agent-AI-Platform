import cloudinary from "../config/cloudinary.js";


export const uploadToCloudinary = async (filename, buffer, contentType) => {
    const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                public_id: filename,
                resource_type: 'auto',
                type: 'authenticated'
            }, (error, result) => {
                if (error) return reject(error)
                resolve(result)
            }
        );

        stream.end(buffer)
    })

    return {
        public_id: result.public_id,
        resource_type: result.resource_type,
        format: result.format
    }
}