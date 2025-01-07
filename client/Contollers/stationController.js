const Station = require('../../models/station');

const getUniqueStations = async (req, res) => {
  try {
    const stations = await Station.aggregate([
      {
        $project: {
          stationNames: { $setUnion: [["$from", "$to"]] }
        }
      },
      {
        $unwind: "$stationNames"
      },
      {
        $group: {
          _id: null,
          uniqueStations: { $addToSet: "$stationNames" }
        }
      },
      {
        $project: {
          _id: 0,
          uniqueStations: 1
        }
      }
    ]);

    res.status(200).json(stations[0].uniqueStations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getUniqueStations };
