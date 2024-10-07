const PlaceDetails = ({ place }) => {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    return(
        <div>
            {place?.photo?.images?.small?.url ? (
                <img src={place.photo.images.small.url} alt="image cannot be displayed"></img>
            ) : (
                <div>image not available</div>
            )}
            <div>name: {place.name}</div>
            <div>address: {place.address}</div>
            <div>distance_string: {place.distance_string}</div>
            {place?.cuisine?.name ? (
                <div>{place.cuisine.name}</div>
            ) : (
                <div>Cuisine type not available</div>
            )}
            <div>opening hours:</div>
            {place?.hours?.week_ranges ? (
                place.hours.week_ranges.map((hours, index) => (
                    <div key={index}>
                        {days[index]}: {hours[0]?.open_time} - {hours[0]?.close_time}
                    </div>
                ))
            ) : (
                <div>Operating hours not available</div>
            )}
            <div>rating: {place.rating}</div>
            <div>latitude: {place.latitude}</div>
            <div>longitude: {place.longitude}</div>
            <div>location_string: {place.location_string}</div>
            <div>num_reviews: {place.num_reviews}</div>
            <div>price: {place.price}</div>
            <div>ranking: {place.ranking}</div>
            <div>web_url: {place.web_url}</div>
            <div>website: {place.website}</div>

        </div>
    );
}

export default PlaceDetails;

/* {
    "location_id": "9982902",
    "name": "Yolo Man Restaurant",
    "latitude": "12.270622",
    "longitude": "109.108154",
    "num_reviews": "3",
    "timezone": "Asia/Ho_Chi_Minh",
    "location_string": "Dien Dien, Khanh Hoa Province",
    "photo": {
        "images": {
            "small": {
                "width": "250",
                "url": "https://media-cdn.tripadvisor.com/media/photo-f/0a/35/c6/91/getlstd-property-photo.jpg",
                "height": "144"
            },
            "thumbnail": {
                "width": "50",
                "url": "https://media-cdn.tripadvisor.com/media/photo-t/0a/35/c6/91/getlstd-property-photo.jpg",
                "height": "50"
            },
            "original": {
                "width": "550",
                "url": "https://media-cdn.tripadvisor.com/media/photo-s/0a/35/c6/91/getlstd-property-photo.jpg",
                "height": "318"
            },
            "large": {
                "width": "550",
                "url": "https://media-cdn.tripadvisor.com/media/photo-s/0a/35/c6/91/getlstd-property-photo.jpg",
                "height": "318"
            },
            "medium": {
                "width": "438",
                "url": "https://media-cdn.tripadvisor.com/media/photo-o/0a/35/c6/91/getlstd-property-photo.jpg",
                "height": "254"
            }
        },
        "is_blessed": true,
        "uploaded_date": "2016-02-02T08:55:35-0500",
        "caption": "getlstd_property_photo",
        "id": "171296401",
        "helpful_votes": "0",
        "published_date": "2016-02-02T08:55:35-0500",
        "user": {
            "user_id": null,
            "member_id": "0",
            "type": "user"
        }
    },
    "awards": [],
    "doubleclick_zone": "as.vietnam",
    "preferred_map_engine": "default",
    "raw_ranking": "3.0432493686676025",
    "ranking_geo": "Dien Dien",
    "ranking_geo_id": "15296278",
    "ranking_position": "1",
    "ranking_denominator": "1",
    "ranking_category": "restaurant",
    "ranking": "#1 of 1 Restaurants in Dien Dien",
    "distance": "8.213921327616687",
    "distance_string": "8.2 km",
    "bearing": "south",
    "rating": "5.0",
    "is_closed": false,
    "open_now_text": "Open Now",
    "is_long_closed": false,
    "price_level": "$$ - $$$",
    "price": "$20,000 - $500,000",
    "description": "",
    "web_url": "https://www.tripadvisor.com/Restaurant_Review-g15296278-d9982902-Reviews-Yolo_Man_Restaurant-Dien_Dien_Khanh_Hoa_Province.html",
    "write_review": "https://www.tripadvisor.com/UserReview-g15296278-d9982902-Yolo_Man_Restaurant-Dien_Dien_Khanh_Hoa_Province.html",
    "ancestors": [
        {
            "subcategory": [
                {
                    "key": "city",
                    "name": "City"
                }
            ],
            "name": "Dien Dien",
            "abbrv": null,
            "location_id": "15296278"
        },
        {
            "subcategory": [
                {
                    "key": "province",
                    "name": "Province"
                }
            ],
            "name": "Khanh Hoa Province",
            "abbrv": null,
            "location_id": "1184689"
        },
        {
            "subcategory": [
                {
                    "key": "country",
                    "name": "Country"
                }
            ],
            "name": "Vietnam",
            "abbrv": null,
            "location_id": "293921"
        }
    ],
    "category": {
        "key": "restaurant",
        "name": "Restaurant"
    },
    "subcategory": [
        {
            "key": "sit_down",
            "name": "Sit down"
        }
    ],
    "parent_display_name": "Dien Dien",
    "is_jfy_enabled": false,
    "nearest_metro_station": [],
    "phone": "+84 58 3772 279",
    "website": "https://www.facebook.com/YOLO-Man-Restaurant-1569064976708000/",
    "email": "thinn80@gmail.com",
    "address_obj": {
        "street1": "24 Dong Khoi",
        "street2": null,
        "city": "Dien Dien",
        "state": null,
        "country": "Vietnam",
        "postalcode": "650000"
    },
    "address": "24 Dong Khoi, Dien Dien 650000 Vietnam",
    "hours": {
        "week_ranges": [
            [
                {
                    "open_time": 540,
                    "close_time": 1380
                }
            ],
            [
                {
                    "open_time": 540,
                    "close_time": 1380
                }
            ],
            [
                {
                    "open_time": 540,
                    "close_time": 1380
                }
            ],
            [
                {
                    "open_time": 540,
                    "close_time": 1380
                }
            ],
            [
                {
                    "open_time": 540,
                    "close_time": 1380
                }
            ],
            [
                {
                    "open_time": 540,
                    "close_time": 1380
                }
            ],
            [
                {
                    "open_time": 540,
                    "close_time": 1380
                }
            ]
        ],
        "timezone": "Asia/Ho_Chi_Minh"
    },
    "is_candidate_for_contact_info_suppression": false,
    "cuisine": [
        {
            "key": "10675",
            "name": "Vietnamese"
        }
    ],
    "dietary_restrictions": [],
    "establishment_types": [
        {
            "key": "10591",
            "name": "Restaurants"
        }
    ]
} */