const rideModel = require('../models/ride.model');
const { publishToQueue } = require('../service/rabbit');

module.exports.createRide = async (req, res) => {
    const { pickup, destination } = req.body;

    const newRide = new rideModel({
        user: req.user.id,
        pickup,
        destination
    });

    publishToQueue("new-ride", JSON.stringify(newRide));

    await newRide.save();

    res.status(201).json({
        message: 'Ride created successfully',
        ride: newRide
    });
}

module.exports.acceptRide = async (req, res) => {
    const { rideId } = req.query;

    const ride = await rideModel.findById(rideId);
    if (!ride) {
        return res.status(404).json({ message: 'Ride not found' });
    }

    
    if (ride.captain) {
        return res.status(400).json({ message: 'Ride already accepted by another captain' });
    }
    
    ride.status = 'accepted';
    await ride.save();

    publishToQueue("ride-accepted", JSON.stringify(ride));

    res.status(200).json({
        message: 'Ride accepted successfully',
        ride
    });
}