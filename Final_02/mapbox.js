let minHeights;
let maxHeights;

let building_id = 0;
let building_data = null;

// define the global variable `mapbox`
let mapbox;

// parse geojson file
fetch('data/nyc-150.geojson')
    .then(response => response.json())
    .then(data => {
        minHeights = Infinity;
        maxHeights = -Infinity;

        data.features.forEach(feature => {
            const heights = feature.properties.heights;
            minHeights = Math.min(minHeights, heights);
            maxHeights = Math.max(maxHeights, heights);

            feature.id = feature.properties.id;
        });

        // store the entire data object as building_data
        building_data = data

        initMap();
    });

function initMap() {
    // set up the initial location of the map
    const initCenter = [-74.0060, 40.7128];
    const initZoom = 12;

    mapboxgl.accessToken = 'pk.eyJ1IjoieWFuZ2hvbmdqaW4iLCJhIjoiY2xndWI5ZGF4MjQ4NjNkcDlwMm5jdXB6NCJ9.B0OP0lGvoBD0mMf2_eC5kQ';
    mapbox = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/yanghongjin/clhdn7g7300gd01qh26q1brqd',
        center: initCenter,
        zoom: initZoom,
    });

    // load the map and geolocation of the building
    mapbox.on('load', () => {

        mapbox.resize()

        // add a source and layers for each building
        mapbox.addSource('nyc-150', {
            type: 'geojson',
            data: 'data/nyc-150.geojson',
            promoteId: 'id',
            cluster: true,
            clusterMaxZoom: 14,
            clusterRadius: 50
        });

        // map the info
        mapbox.addLayer({
            id: 'nyc-150-clusters',
            type: 'circle',
            source: 'nyc-150',
            paint: {
                'circle-stroke-width': 1,
                'circle-color': [
                    'step',
                    ['get', 'point_count'],
                    '#E4C8A5',
                    17,
                    '#DB9F72',
                    35,
                    '#C28563',
                ],
                'circle-stroke-color': '#A94E1C',

                // create hover effect by case where feature state is a bool
                'circle-opacity': [
                    'case',
                    ['boolean', ['feature-state', 'hover'], false],
                    1,
                    0.8
                ],

                'circle-radius': [
                    'step',
                    ['get', 'point_count'],
                    10, 5,
                    10, 10,
                    20, 20,
                    30, 30,
                    40, 40,
                    50
                ]
            }
        })

        // add count to the cluster number
        mapbox.addLayer({
            id: 'cluster-count',
            type: 'symbol',
            source: 'nyc-150',
            filter: ['has', 'point_count'],
            layout: {
                'text-field': ['get', 'point_count_abbreviated'],
                'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
                'text-size': 12
            },
            paint: {
                "text-color": "black"
            }
        });

        mapbox.addLayer({
            id: 'nyc-150-unclustered',
            type: 'circle',
            source: 'nyc-150',
            filter: ['!', ['has', 'point_count']],
            paint: {
                'circle-color': [
                    'match',
                    ['get', 'uses'],
                    'residential', '#DE5F56',
                    'office', '#8178A9',
                    'hotel', '#905C96',
                    'hybrid', '#6B827D',
                    '#9EA6A1'
                ],
                'circle-radius': 4.5,
                'circle-stroke-width': 2.5,
                'circle-stroke-color': '#CFC9C5'
            }
        });

        // Inspect a cluster on click
        mapbox.on('click', 'nyc-150-clusters', (e) => {
            const features = mapbox.queryRenderedFeatures(e.point, {
                layers: ['nyc-150-clusters']
            });

            if (features.length > 0 && features[0].properties.cluster) {
                const clusterId = features[0].properties.cluster_id;
                mapbox.getSource('nyc-150').getClusterExpansionZoom(
                    clusterId,
                    (err, zoom) => {
                        if (err) return;

                        mapbox.easeTo({
                            center: features[0].geometry.coordinates,
                            zoom: zoom
                        });
                    }
                );
            }
        });

        // When a click event occurs on a feature in the unclustered-point layer, open a popup at the location
        mapbox.on('click', 'nyc-150-unclustered', (e) => {
            if (!e.features || !e.features[0] || !e.features[0].geometry) {
                return;
            }
            const coordinates = e.features[0].geometry.coordinates.slice();
            const name = e.features[0].properties.name;
            const uses = e.features[0].properties.uses;
            const notes = e.features[0].properties.notes;

            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }

            new mapboxgl.Popup()
                .setLngLat(coordinates)
                .setHTML(
                    `<strong>${name}</strong><br>${notes}`
                )
                .addTo(mapbox);
        });

        // mapbox.on('mouseenter', 'clusters', () => {
        //     mapbox.getCanvas().style.cursor = 'pointer';
        // });
        // mapbox.on('mouseleave', 'clusters', () => {
        //     mapbox.getCanvas().style.cursor = '';
        // });
        // click the points to get info, e to get the x and y coordinate inside the container
        // mapbox.on('click', (e) => {
        //     const [selectedBuilding] = mapbox.queryRenderedFeatures(e.point, {
        //         layers: ['nyc-150-pts']
        //     });

        //     if (selectedBuilding) {
        //         alert(selectedBuilding.properties.floors)
        //     }
        // })

        // let hoveredStateId = null

        // mapbox.on('mousemove', 'nyc-150-pts', (e) => {
        //     if (e.features.length > 0) {
        //         if (hoveredStateId !== null) {
        //             mapbox.setFeatureState(
        //                 { source: 'nyc-150', id: hoveredStateId },
        //                 { hover: false }
        //             );
        //         }
        //         hoveredStateId = e.features[0].id;
        //         mapbox.setFeatureState(
        //             { source: 'nyc-150', id: hoveredStateId },
        //             { hover: true }
        //         );
        //     }
        // });

        // // toggle of the hover effect when mouse move away
        // mapbox.on('mouseleave', 'nyc-150-pts', () => {
        //     if (hoveredStateId !== null) {
        //         mapbox.setFeatureState(
        //             { source: 'nyc-150', id: hoveredStateId },
        //             { hover: false }
        //         );
        //     }
        //     hoveredStateId = null;
        // });
    });


    // fly to the building
    // document.querySelector('#fly').addEventListener('click', () => {
    //     console.log('click');

    //     if (building_data) {
    //         const current_id = building_data.features[building_id];
    //         console.log('Current building:', current_id);

    //         mapbox.flyTo({
    //             center: current_id.geometry.coordinates,
    //             zoom: 16,
    //             bearing: Math.random() * 180 - 90,
    //             pitch: Math.random() * 180 - 90
    //         });
    //         // } else {
    //         //     console.log('Building data not loaded');
    //     }

    //     building_id = (building_id + 1) % building_data.features.length;
    //     console.log('Next building index:', building_id);
    // });

    // reset the view
    document.querySelector('#reset').addEventListener('click', () => {
        console.log('click');
        mapbox.flyTo({
            center: initCenter,
            zoom: initZoom,
            pitch: 0
        })
    })

    // load Building in 3d
    // mapbox.on('style.load', () => {
    //     // Insert the layer beneath any symbol layer.
    //     const layers = mapbox.getStyle().layers;
    //     const labelLayerId = layers.find(
    //         (layer) => layer.type === 'symbol' && layer.layout['text-field']
    //     ).id;

    //     // The 'building' layer in the Mapbox Streets
    //     // vector tileset contains building height data
    //     // from OpenStreetMap.
    //     mapbox.addLayer(
    //         {
    //             'id': 'add-3d-buildings',
    //             'source': 'composite',
    //             'source-layer': 'building',
    //             'filter': ['==', 'extrude', 'true'],
    //             'type': 'fill-extrusion',
    //             'minzoom': 15,
    //             'paint': {
    //                 'fill-extrusion-color': '#aaa',

    //                 // Use an 'interpolate' expression to
    //                 // add a smooth transition effect to
    //                 // the buildings as the user zooms in.
    //                 'fill-extrusion-height': [
    //                     'interpolate',
    //                     ['linear'],
    //                     ['zoom'],
    //                     15,
    //                     0,
    //                     15.05,
    //                     ['get', 'height']
    //                 ],
    //                 'fill-extrusion-base': [
    //                     'interpolate',
    //                     ['linear'],
    //                     ['zoom'],
    //                     15,
    //                     0,
    //                     15.05,
    //                     ['get', 'min_height']
    //                 ],
    //                 'fill-extrusion-opacity': 0.6
    //             }
    //         },
    //         labelLayerId
    //     );
    // });

    // add the eventlistening to hear the message

    window.addEventListener('message', function (event) {
        // Check if the message is of the correct type
        if (event.data.type === 'buildingClick') {
            let coordinates = event.data.coordinates;

            // Fly to the clicked building
            mapbox.flyTo({
                center: coordinates,
                zoom: 16,
                bearing: Math.random() * 40 - 20,
                pitch: Math.random() * 180 - 90
            });
        }
    });

    window.addEventListener('Message', function (event) {
        if (event.data.type === 'resetMap') {

            mapbox.flyTo({
                center: initCenter,
                zoom: initZoom,
                pitch: 0
            })
        }
    })
}