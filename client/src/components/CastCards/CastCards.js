import React from "react";
import { Card, CardGroup } from "react-bootstrap";

const CastCards = () => {
    const images = [
        "https://t2.gstatic.com/licensed-image?q=tbn:ANd9GcS3MlXFcbiqlh9nyNn_yuqiN5wtuSeONtor5KvmjcNs1osZ9w_c-xSPfD07GqimoGjm2zMtc6qJ_iEBpzQ",
        "https://t0.gstatic.com/licensed-image?q=tbn:ANd9GcSgCvh-siT0NyImtruyscxMnOJsGMLQfBUAAhVY3Qw_2kzojUpw2SAZkJnJg7symxUEiuJYYPCEM5VFj0s",
        "https://t2.gstatic.com/licensed-image?q=tbn:ANd9GcSOsmRDeoGqBsQCmPkDD7vkpr1Rt3T9fZnE98OxEyShm9zSmI806KHVoEL_rQl1uGQ-QzSgo_rJqhwwkqM",
        "https://m.media-amazon.com/images/S/pv-target-images/85a67f76cd3134aa10fd83c64b87034299cb62acb1315510d5e55a9ac83ade51.jpg"
    ]
    return (
        <div>
            <br></br>
            <h2>Cast</h2>
            <CardGroup style={{ display: "flex", overflowX: "scroll" }}>
                {images.map((image, index) => (
                    <Card key={index}
                        style={{
                            flex: 1,
                            maxWidth: "150px",
                            maxHeight: "200px",
                            marginRight: "10px",
                        }}
                    >
                        <Card.Img
                            variant="top"
                            src={image}
                            alt="Cast Member"
                            style={{ objectFit: "cover", height: "100%", width: "100%" }}
                        />
                    </Card>
                ))}
            </CardGroup>
        </div>
    );
};



export default CastCards;