const { JWT_SECRET_KEY, JWT_EXPIRES_IN } = require("../config/configs");
const { DOESNT_EXIST } = require("../constant/constants");
const Brand = require("../model/brandDbRequestModel");
const bcrypt = require("bcrypt"); // For password hashing
const jwt = require("jsonwebtoken");
const cron = require("node-cron");
const OTP = require("../model/otp");
const Collaboration = require("../model/collaboration");

// Signup a brand
exports.signup = async (req, res) => {
  const {
    name,
    email,
    password,
    category,
    brandName,
    isSelectedImage,
    profileUrl,
  } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);
  const brand = new Brand({
    name,
    email,
    password: hashedPassword,
    category,
    profileUrl: isSelectedImage ? profileUrl : req.file?.path,
    brandName,
    isSelectedImage,
  });
  brand
    .save()
    .then(() => {
      res.status(201).json({ message: "Brand signed up successfully" });
    })
    .catch((err) => {
      res.status(500).json({ message: "An error occurred", error: err });
    });
};

// Login as a brand (basic example, should be replaced with authentication logic)
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const brand = await Brand.findOne({ email });

    if (!brand) {
      return res.status(404).json({ message: "Brand not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, brand.password);

    if (isPasswordValid) {
      // Generate JWT token
      const token = jwt.sign({ brandId: brand._id }, JWT_SECRET_KEY, {
        expiresIn: JWT_EXPIRES_IN,
      });

      // Return token and brandId in response
      res
        .status(200)
        .json({ message: "Login successful", token, brandId: brand._id });
    } else {
      res.status(401).json({ message: "Authentication failed" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get brand's profile
exports.getProfile = async (req, res) => {
  const brandId = req.params.brandId;

  try {
    const brand = await Brand.findById(brandId);

    if (!brand) {
      return res.status(404).json({ message: "Brand not found" });
    }

    res.status(200).json({
      message: "Brand profile fetched successfully",
      brand: {
        brandName: brand.brandName,
        email: brand.email,
        category: brand.category,
        profileUrl: brand.profileUrl,
        isSelectedImage: brand.isSelectedImage,
        name: brand.name,
      },
    });
  } catch (error) {
    console.error("Error fetching brand profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update brand's profile (requires authentication)
exports.updateProfile = async (req, res) => {
  const brandId = req.params.brandId;
  const {
    name,
    email,
    category,
    isSelectedImage,
    brandName,
    profileUrl,
  } = req.body;

  const updatedFields = {
    name: name || undefined,
    email: email || undefined,
    category: category || undefined,
    brandName: brandName || undefined,
    isSelectedImage: isSelectedImage || undefined,
  };

  try {
    const brand = await Brand.findById(brandId);
    if (!brand) {
      return res.status(404).json({ message: "Brand not found" });
    }

    // Handle profile picture update
    if (req.file) {
      updatedFields.profileUrl = req.file.path;
    }
    if (isSelectedImage) {
      updatedFields.profileUrl = profileUrl;
    }

    Object.keys(updatedFields).forEach(
      (key) => updatedFields[key] === undefined && delete updatedFields[key]
    );

    const updatedBrand = await Brand.findByIdAndUpdate(brandId, updatedFields, {
      new: false,
    });

    res.status(200).json({
      message: "Brand profile updated successfully",
      brand: {
        name: updatedBrand.name,
        email: updatedBrand.email,
        category: updatedBrand.category,
        profileUrl: updatedBrand.profileUrl,
        brandName: updatedBrand.brandName,
        isSelectedImage: updatedBrand.isSelectedImage,
      },
    });
  } catch (error) {
    console.error("Error updating brand profile:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete brand's profile (requires authentication)
exports.deleteProfile = async (req, res) => {
  const brandId = req.params.brandId;

  try {
    const deletedBrand = await Brand.findByIdAndDelete(brandId);

    if (!deletedBrand) {
      return res.status(404).json({ message: "Brand not found" });
    }
    res.status(200).json({ message: "Brand profile deleted successfully" });
  } catch (error) {
    console.error("Error deleting brand profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Fetch list of all brands (excluding passwords)
exports.getAllBrands = async (req, res) => {
  try {
    // Fetch all brands excluding the password field
    const brands = await Brand.find({}, "-password");

    // Get collaboration counts for each brand
    const collaborationCounts = await Collaboration.aggregate([
      {
        $group: {
          _id: "$brandId",
          count: { $sum: 1 },
        },
      },
    ]);

    // Create a map for easier lookup
    const collaborationCountMap = {};
    collaborationCounts.forEach((item) => {
      collaborationCountMap[item._id.toString()] = item.count;
    });

    // Map over brands to include the collaboration count
    const brandsWithCollaborationCount = brands.map((brand) => ({
      _id: brand._id,
      name: brand.name,
      category: brand.category,
      profileUrl: brand.profileUrl,
      isSelectedImage: brand.isSelectedImage,
      brandName: brand.brandName,
      collaborationCount: collaborationCountMap[brand._id.toString()] || 0,
    }));
    res.status(200).json({
      message: "List of all brands fetched successfully",
      brands: brandsWithCollaborationCount,
    });
  } catch (error) {
    console.error("Error fetching brands:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Define cron job to delete expired OTPs older than 1 hour
cron.schedule("0 * * * *", async () => {
  try {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const result = await OTP.deleteMany({ otpExpires: { $lt: oneHourAgo } });

    console.log(`Deleted ${result.deletedCount} expired OTPs`);
  } catch (error) {
    console.error("Error deleting expired OTPs:", error);
  }
});
