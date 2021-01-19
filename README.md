# image-ocr-service

Handles OCR 

## API
| Path          | Parameter   | Function                           |
|---------------|-------------|------------------------------------|
| /             | none        | online check                       |
| /ocr          | none        | reads image and does ocr on it     |
| /ocr/:weekId  | weekId a number | reads the image with the given id and does ocr on it |

### Run with
        
    node app.js

### Environment Variables 
    
- MONGODB_CONNECTION_STRING
- MONGODB_WEEKNUM_IMAGE_COLLECTION
- MONGODB_WEEKDAYMEAL_COLLECTION
