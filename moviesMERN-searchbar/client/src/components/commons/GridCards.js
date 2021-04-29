import React from 'react'
import { Col, Card } from 'antd';
import { IMAGE_BASE_URL } from '../Config';

function GridCards(props) {
    const { Meta } = Card;

    let { actor, key, image, movieId, movieName, characterName } = props
    const POSTER_SIZE = "w154";

    if (actor) {
        return (
            <Col key={key} lg={6} md={8} xs={24}>
                <div style={{ position: 'relative' }}>
                    <Card
                        style={{ width: '80%', height: '50%' }}
                        cover={<img alt={characterName} src={`${IMAGE_BASE_URL}${POSTER_SIZE}${image}`} />}
                    >
                        <Meta title={characterName} />
                    </Card>


                </div>
            </Col>
        )
    } else {
        return (
            <Col key={key} lg={6} md={8} xs={24}>
                <div style={{ position: 'relative' }}>
                    <a href={`/movie/${movieId}`} >
                        <img style={{ width: '80%', height: '50%' }} alt={movieName} src={image} />
                    </a>
                </div>
            </Col>
        )

    }

}

export default GridCards