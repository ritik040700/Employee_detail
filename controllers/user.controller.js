const bcrypt = require("bcrypt")
const User = require("../models/user");
const { generateToken } = require("../utils/generate-token");

require("dotenv").config();
module.exports.createUser = async(req,res,next)=>{
    try{
        console.log({body:req.body})
        const {
            email,
            password,
            name,
            address,
            latitude,
            longitude,
           
           
        } = req.body;
        let userExists = await User.exists({ email });
    if (userExists) throw new Error("user already exists");
    const passwordHash = await bcrypt.hash(password, 10);
    
    const user = await User.create({
        email,
        password,
        name,
        address,
        latitude,
        longitude,

        password: passwordHash,
        
      });
      const accessToken = generateToken(user);
      user.token = accessToken;
    await user.save();
      const userResponse = { ...user._doc, token:accessToken };
    delete userResponse.password;
      
      res.status(200).json({
        status_code: "200",
        message: "Success User Create",
        data:userResponse
      });
    } catch (err) {
        next(err);
      }
};

module.exports.changeStatus = async (req, res, next) => {
    try {
       await User.updateMany(
        {},
        [
          {
            $set: {
              status: {
                $cond: {
                  if: { $eq: ["$status", "active"] },
                  then: "inactive",
                  else: "active"
                }
              }
            }
          }
        ]
      );
  
      res.status(200).json({
        status_code: "200",
        message: "Successfully changed statuses",
        
      });
    } catch (err) {
      next(err);
    }
  };
  
  function haversineDistance(lat1, lon1, lat2, lon2) {
    const toRadians = angle => (Math.PI / 180) * angle;
  
    const R = 6371; 
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
  
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
  
    return distance; 
  }
  

  module.exports.distanceCalculate = async (req, res, next) => {
    try {
        const {
            Destination_Latitude,
            Destination_Longitude
        } = req.body;
        const requestId = req.params.requestId;
        const user = await User.findOne({token:requestId})
        const userLatitude = parseFloat(user.latitude);
        const userLongitude = parseFloat(user.longitude);
    
       
        const destinationLatitude = parseFloat(Destination_Latitude);
        const destinationLongitude = parseFloat(Destination_Longitude);
    
        
        const distance = haversineDistance(
          userLatitude, userLongitude,
          destinationLatitude, destinationLongitude
        );
    
        res.status(200).json({
            status_code: "200",
            message: "Distance calculated successfully",
           distance: `${distance.toFixed(2)} km`
        });
    } catch (err) {
      next(err);
    }
  }


  function getDayIndex(date) {
    return date.getDay(); 
  }
  
  
  function getDayName(dayIndex) {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return daysOfWeek[dayIndex];
  } 
  async function formatUsersByWeek(week_number) {
    try {
      const users = await User.find();
      const usersByDay = {};
  
   
      users.forEach(user => {
        const creationDate = new Date(user.createdAt);
        const dayIndex = getDayIndex(creationDate);
  
        
        if (week_number.includes(dayIndex)) {
          const dayName = getDayName(dayIndex); 
          const userDetails = { name: user.name, email: user.email }; 
  
          
          if (!usersByDay[dayName]) {
            usersByDay[dayName] = [];
          }
  
          
          usersByDay[dayName].push(userDetails);
        }
      });
  
      
      return { data: usersByDay };
    } catch (err) {
      console.error('Error fetching users:', err);
      throw err; 
    }
  }
  
  
  function getDayName(dayIndex) {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return daysOfWeek[dayIndex];
  } 

  module.exports.userDetail = async(req,res,next) =>{
    try{
        const {
            week_number
        } = req.body;
        const usersByWeek = await formatUsersByWeek(week_number);
res.status(200).json({
    status_code: "200",
      message: "Users grouped by creation day",
      ...usersByWeek
})

    }catch (err) {
      next(err);
    }
  }