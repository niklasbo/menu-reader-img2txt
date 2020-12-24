# image-ocr-service

Handles OCR and Client-REST-Calls

## API
| Path          | Parameter   | Function                           |
|---------------|-------------|------------------------------------|
| /             | none        | online check                       |
| /ocr          | none        | reads image and does ocr on it     |
| /current-week | none        | get the data for current week      |
| /week/:weekId | weekId a number | get the data for given weeknum |


### Run with
        
    node app.js

### Environment Variables 
    
- MONGODB_CONNECTION_STRING
- MONGODB_WEEKNUM_IMAGE_COLLECTION
- MONGODB_WEEKDAYMEAL_COLLECTION
