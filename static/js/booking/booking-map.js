/*=========================================================
                LEAFLET & GOOGLE MAP
=========================================================*/

// Google Map Instance
let map;

// Pickup & Delivery Markers
let pickupMarker = null;
let deliveryMarker = null;

// Pickup & Delivery Routes
let pickupRoute = null;
let deliveryRoute = null;


/*=========================================================
                STORE LOCATION
=========================================================*/

const STORE_LAT = window.WashEasyConfig.STORE_LAT;

const STORE_LNG = window.WashEasyConfig.STORE_LNG;

/*=========================================================
                INITIALIZE MAP
=========================================================*/

window.addEventListener(
    'load',
    function(){

        // Create Map
        map = L.map('map').setView(
            [STORE_LAT, STORE_LNG],
            14
        );

        // OpenStreetMap Tiles
        L.tileLayer(
            'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
            {
                attribution:
                '&copy; OpenStreetMap contributors'
            }
        ).addTo(map);


        // Store Marker
        L.marker(
            [STORE_LAT, STORE_LNG]
        )
        .addTo(map)
        .bindPopup(
            'WashEasy Store'
        )
        .openPopup();


        // Refresh Map After Step 2 Opens
        document.addEventListener(
            "bookingStepVisible",
            function(){

                setTimeout(() => {

                    map.invalidateSize();

                }, 200);

            }
        );

    }
);


/*=========================================================
                CALCULATE DISTANCE
=========================================================*/

function calculateDistance(
    lat1,
    lon1,
    lat2,
    lon2
){

    const R = 6371;

    const dLat =
        (lat2 - lat1)
        * Math.PI / 180;

    const dLon =
        (lon2 - lon1)
        * Math.PI / 180;

    const a =
        Math.sin(dLat / 2)
        * Math.sin(dLat / 2)
        +
        Math.cos(
            lat1 * Math.PI / 180
        )
        *
        Math.cos(
            lat2 * Math.PI / 180
        )
        *
        Math.sin(dLon / 2)
        *
        Math.sin(dLon / 2);

    const c =
        2 *
        Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
        );

    return R * c;

}


/*=========================================================
                RECALCULATE TRANSPORT FEE
=========================================================*/

function recalculateTransportFee(){

    // Pickup Distance
    const pickupDistance =
        parseFloat(
            document.getElementById(
                "id_pickup_distance_km"
            ).value || 0
        );

    // Delivery Distance
    const deliveryDistance =
        parseFloat(
            document.getElementById(
                "id_delivery_distance_km"
            ).value || 0
        );

    // Total Distance
    const totalDistance =
        pickupDistance +
        deliveryDistance;

    document.getElementById(
        "total-distance"
    ).innerText =
        totalDistance.toFixed(2) +
        " km";

    document.getElementById(
        "id_total_distance_km"
    ).value =
        totalDistance.toFixed(2);

    // Transport Price Per Kilometer
    const PRICE_PER_KM =
    window.WashEasyConfig.PRICE_PER_KM;

    // Calculate Transport Fee
    const transportFee =
        totalDistance *
        PRICE_PER_KM;

    document.getElementById(
        "transport-fee"
    ).innerText =
        "₦" +
        transportFee.toLocaleString();

    // Update Grand Total
    updateGrandTotal();

}

/*=========================================================
                INITIALIZE GOOGLE AUTOCOMPLETE
=========================================================*/

function initAutocomplete(){

    // Pickup & Delivery Input Fields
    const pickupInput =
        document.getElementById(
            'pickup-address'
        );

    const deliveryInput =
        document.getElementById(
            'delivery-address'
        );

    // Exit If Inputs Do Not Exist
    if(
        !pickupInput ||
        !deliveryInput
    ){
        return;
    }


    /*=====================================================
                    GOOGLE AUTOCOMPLETE
    =====================================================*/

    const pickupAutocomplete =
        new google.maps.places.Autocomplete(
            pickupInput,
            {
                componentRestrictions:{
                    country:['ng']
                }
            }
        );

    const deliveryAutocomplete =
        new google.maps.places.Autocomplete(
            deliveryInput,
            {
                componentRestrictions:{
                    country:['ng']
                }
            }
        );


    /*=====================================================
                    PICKUP ADDRESS
    =====================================================*/

    pickupAutocomplete.addListener(
        'place_changed',
        function(){

            const place =
                pickupAutocomplete.getPlace();

            if(
                !place.geometry
            ){
                return;
            }

            const lat =
                place.geometry
                .location
                .lat();

            const lng =
                place.geometry
                .location
                .lng();


            // Pickup Distance
            const pickupDistance =
                calculateDistance(
                    lat,
                    lng,
                    STORE_LAT,
                    STORE_LNG
                );

            document.getElementById(
                'summary-pickup-distance'
            ).innerText =
                pickupDistance.toFixed(2)
                + ' km';

            document.getElementById(
                "pickup-distance"
            ).innerText =
                pickupDistance.toFixed(2)
                + " km";

            document.getElementById(
                'id_pickup_distance_km'
            ).value =
                pickupDistance.toFixed(2);


            /*=================================================
                        GET DELIVERY DISTANCE
            =================================================*/

            const deliveryDistance =
                parseFloat(
                    document.getElementById(
                        'id_delivery_distance_km'
                    ).value || 0
                );


            /*=================================================
                        TOTAL DISTANCE
            =================================================*/

            const totalDistance =
                pickupDistance +
                deliveryDistance;

            document.getElementById(
                'total-distance'
            ).innerText =
                totalDistance.toFixed(2)
                + ' km';

            document.getElementById(
                'id_total_distance_km'
            ).value =
                totalDistance.toFixed(2);


            /*=================================================
                        TRANSPORT FEE
            =================================================*/

            const PRICE_PER_KM =
                window.WashEasyConfig.PRICE_PER_KM;

            const transportFee =
                totalDistance *
                PRICE_PER_KM;

            document.getElementById(
                'transport-fee'
            ).innerText =
                '₦' +
                transportFee.toLocaleString();

            updateGrandTotal();


            /*=================================================
                        SAVE COORDINATES
            =================================================*/

            document.getElementById(
                'id_pickup_latitude'
            ).value = lat;

            document.getElementById(
                'id_pickup_longitude'
            ).value = lng;


            /*=================================================
                        REMOVE OLD MARKER
            =================================================*/

            if(pickupMarker){

                map.removeLayer(
                    pickupMarker
                );

            }

            if(pickupRoute){

                map.removeLayer(
                    pickupRoute
                );

            }


            /*=================================================
                        CREATE NEW MARKER
            =================================================*/

            pickupMarker =
                L.marker(
                    [lat, lng]
                )
                .addTo(map)
                .bindPopup(
                    'Pickup Location'
                );


            /*=================================================
                        CREATE ROUTE
            =================================================*/

            pickupRoute =
                L.polyline(
                    [
                        [lat, lng],
                        [STORE_LAT, STORE_LNG]
                    ],
                    {
                        color:'#0d6efd',
                        weight:6
                    }
                )
                .addTo(map);


            /*=================================================
                        UPDATE MAP VIEW
            =================================================*/

            map.setView(
                [lat, lng],
                14
            );

        }

    );


    /*=====================================================
                    DELIVERY ADDRESS
    =====================================================*/

    deliveryAutocomplete.addListener(
        'place_changed',
        function(){

            const place =
                deliveryAutocomplete.getPlace();

            if(
                !place.geometry
            ){
                return;
            }

            const lat =
                place.geometry
                .location
                .lat();

            const lng =
                place.geometry
                .location
                .lng();


            /*=================================================
                    DELIVERY DISTANCE
            =================================================*/

            const deliveryDistance =
                calculateDistance(
                    STORE_LAT,
                    STORE_LNG,
                    lat,
                    lng
                );

            document.getElementById(
                'summary-delivery-distance'
            ).innerText =
                deliveryDistance.toFixed(2)
                + ' km';

            document.getElementById(
                "delivery-distance"
            ).innerText =
                deliveryDistance.toFixed(2)
                + " km";

            document.getElementById(
                'id_delivery_distance_km'
            ).value =
                deliveryDistance.toFixed(2);


            /*=================================================
                    GET PICKUP DISTANCE
            =================================================*/

            const pickupDistance =
                parseFloat(
                    document.getElementById(
                        'id_pickup_distance_km'
                    ).value || 0
                );


            /*=================================================
                    TOTAL DISTANCE
            =================================================*/

            const totalDistance =
                pickupDistance +
                deliveryDistance;

            document.getElementById(
                'total-distance'
            ).innerText =
                totalDistance.toFixed(2)
                + ' km';

            document.getElementById(
                'id_total_distance_km'
            ).value =
                totalDistance.toFixed(2);


            /*=================================================
                    TRANSPORT FEE
            =================================================*/

            const PRICE_PER_KM =
                window.WashEasyConfig.PRICE_PER_KM;

            const transportFee =
                totalDistance *
                PRICE_PER_KM;

            document.getElementById(
                'transport-fee'
            ).innerText =
                '₦' +
                transportFee.toLocaleString();

            updateGrandTotal();


            /*=================================================
                    SAVE COORDINATES
            =================================================*/

            document.getElementById(
                'id_delivery_latitude'
            ).value = lat;

            document.getElementById(
                'id_delivery_longitude'
            ).value = lng;


            /*=================================================
                    REMOVE OLD MARKER
            =================================================*/

            if(
                deliveryMarker
            ){

                map.removeLayer(
                    deliveryMarker
                );

            }

            if(
                deliveryRoute
            ){

                map.removeLayer(
                    deliveryRoute
                );

            }
                        /*=================================================
                    CREATE NEW MARKER
            =================================================*/

            deliveryMarker =
                L.marker(
                    [lat, lng]
                )
                .addTo(map)
                .bindPopup(
                    'Delivery Location'
                );


            /*=================================================
                    CREATE ROUTE
            =================================================*/

            deliveryRoute =
                L.polyline(
                    [
                        [STORE_LAT, STORE_LNG],
                        [lat, lng]
                    ],
                    {
                        color:'#198754',
                        weight:6
                    }
                )
                .addTo(map);


            /*=================================================
                    FIT MAP TO SHOW BOTH LOCATIONS
            =================================================*/

            const group =
                new L.featureGroup(
                    [
                        pickupMarker,
                        deliveryMarker
                    ].filter(Boolean)
                );

            map.fitBounds(
                group.getBounds(),
                {
                    padding:[50,50]
                }
            );

        }

    );

}


/*=========================================================
                CLEAR PICKUP ADDRESS
=========================================================*/

document
    .getElementById("clearPickup")
    .addEventListener(
        "click",
        function(){

            // Clear Pickup Address
            document.getElementById(
                "pickup-address"
            ).value = "";


            // Reset Pickup Distance
            document.getElementById(
                "pickup-distance"
            ).innerText = "0 km";

            document.getElementById(
                "summary-pickup-distance"
            ).innerText = "0 km";

            document.getElementById(
                "id_pickup_distance_km"
            ).value = 0;


            // Clear Coordinates
            document.getElementById(
                "id_pickup_latitude"
            ).value = "";

            document.getElementById(
                "id_pickup_longitude"
            ).value = "";


            // Remove Pickup Marker
            if(pickupMarker){

                map.removeLayer(
                    pickupMarker
                );

                pickupMarker = null;

            }


            // Remove Pickup Route
            if(pickupRoute){

                map.removeLayer(
                    pickupRoute
                );

                pickupRoute = null;

            }


            // Recalculate Transport Fee
            recalculateTransportFee();

        }

    );


/*=========================================================
                CLEAR DELIVERY ADDRESS
=========================================================*/

document
    .getElementById("clearDelivery")
    .addEventListener(
        "click",
        function(){

            // Clear Delivery Address
            document.getElementById(
                "delivery-address"
            ).value = "";


            // Reset Delivery Distance
            document.getElementById(
                "delivery-distance"
            ).innerText = "0 km";

            document.getElementById(
                "summary-delivery-distance"
            ).innerText = "0 km";

            document.getElementById(
                "id_delivery_distance_km"
            ).value = 0;


            // Clear Coordinates
            document.getElementById(
                "id_delivery_latitude"
            ).value = "";

            document.getElementById(
                "id_delivery_longitude"
            ).value = "";


            // Remove Delivery Marker
            if(deliveryMarker){

                map.removeLayer(
                    deliveryMarker
                );

                deliveryMarker = null;

            }


            // Remove Delivery Route
            if(deliveryRoute){

                map.removeLayer(
                    deliveryRoute
                );

                deliveryRoute = null;

            }


            // Recalculate Transport Fee
            recalculateTransportFee();

        }

    );


/*=========================================================
                INITIALIZE AUTOCOMPLETE
=========================================================*/

window.addEventListener(
    'load',
    initAutocomplete
);