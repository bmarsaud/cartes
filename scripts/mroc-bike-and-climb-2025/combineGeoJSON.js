const fs = require('fs');
const path = require('path');

// Function to extract heart rate value from ns3_TrackPointExtension string
function extractHeartRate(ns3TrackPointExtension) {
  if (!ns3TrackPointExtension) return null;

  const match = ns3TrackPointExtension.match(/<ns3:hr>(\d+)<\/ns3:hr>/);
  return match ? parseInt(match[1], 10) : null;
}

// Function to combine GeoJSON files
async function combineGeoJSON(inputDir, outputFile) {
  try {
    // Get all GeoJSON files in the input directory
    const files = fs.readdirSync(inputDir)
      .filter(file => file.endsWith('.geojson') || file.endsWith('.json'))
      .map(file => path.join(inputDir, file));

    if (files.length === 0) {
      console.error('No GeoJSON files found in the input directory.');
      return;
    }

    console.log(`Found ${files.length} GeoJSON files to combine.`);

    // Initialize the combined GeoJSON structure
    const combinedGeoJSON = {
      type: "FeatureCollection",
      name: "track_points",
      features: []
    };

    let currentTrackFid = 0;
    let currentTrackSegPointId = 0;

    // Process each file
    for (const file of files) {
      console.log(`Processing file: ${file}`);

      const fileContent = fs.readFileSync(file, 'utf8');
      let geoJSON;

      try {
        geoJSON = JSON.parse(fileContent);
      } catch (error) {
        console.error(`Error parsing ${file}: ${error.message}`);
        continue;
      }

      if (!geoJSON.features || !Array.isArray(geoJSON.features)) {
        console.error(`Invalid GeoJSON structure in ${file}`);
        continue;
      }

      // Process each feature in the current file
      for (const feature of geoJSON.features) {
        // Clone the feature to avoid modifying the original
        const processedFeature = JSON.parse(JSON.stringify(feature));

        // Update track_fid and track_seg_point_id to be continuous
        if (processedFeature.properties) {
          // Keep the original track_seg_id but make track_fid continuous
          processedFeature.properties.track_fid = currentTrackFid;
          processedFeature.properties.track_seg_point_id = currentTrackSegPointId++;

          // Process ns3_TrackPointExtension to extract heart rate
          if (processedFeature.properties.ns3_TrackPointExtension) {
            processedFeature.properties.heart_rate = extractHeartRate(processedFeature.properties.ns3_TrackPointExtension);
            delete processedFeature.properties.ns3_TrackPointExtension;
          }
        }

        combinedGeoJSON.features.push(processedFeature);
      }

      // Increment track_fid for the next file
      currentTrackFid++;
    }

    // Write the combined GeoJSON to the output file
    fs.writeFileSync(outputFile, JSON.stringify(combinedGeoJSON, null, 2));

    console.log(`Successfully combined ${combinedGeoJSON.features.length} features from ${files.length} files.`);
    console.log(`Output written to: ${outputFile}`);

  } catch (error) {
    console.error(`Error combining GeoJSON files: ${error.message}`);
  }
}

// Command line arguments
const args = process.argv.slice(2);

if (args.length < 2) {
  console.log('Usage: node combineGeoJSON.js <inputDirectory> <outputFile>');
  console.log('Example: node combineGeoJSON.js ./geojson_files ./combined.geojson');
  process.exit(1);
}

const inputDir = args[0];
const outputFile = args[1];

// Execute the function
combineGeoJSON(inputDir, outputFile);
