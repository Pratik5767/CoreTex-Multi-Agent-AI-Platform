import cloudinary from "../config/cloudinary.js";


export const getFromCloudinary = (filename, resource_type, format, expiresIn = 600) => {
    const timestamp = Math.floor(Date.now() / 1000) + expiresIn

    return cloudinary.url(filename, {
        sign_url: true,
        type: "authenticated",
        resource_type: resource_type,
        format: format,
        expires_at: timestamp
    })
}