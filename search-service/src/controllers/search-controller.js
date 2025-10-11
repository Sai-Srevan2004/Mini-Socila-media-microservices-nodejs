const Search = require("../models/Search");
const logger = require("../utils/logger");

const searchPostController = async (req, res) => {
  logger.info("Search endpoint hit!");
  try {
    const { query } = req.query;

    if (!query || query.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Search query is required!",
      });
    }

    const results = await Search.find(
      {
        $text: { $search: query },
      },
      {
        score: { $meta: "textScore" },
      }
    )
      .sort({ score: { $meta: "textScore" } })
      .limit(10);

    if(results.length==0)
    {
        return res.status(404).json({
        success:false,
        message:"No search results found!",
        data:results
    }); 
    }

    return res.status(200).json({
        success:true,
        message:"Fecthed search results",
        data:results
    });
  } catch (error) {
    logger.error("Error while searching post", error);
    res.status(500).json({
      success: false,
      message: "Error while searching post",
      error:error.message
    });
  }
};



// Temporary controller to insert test search data
const createSearchPost = async (req, res) => {
  logger.info("Create Search Post endpoint hit");
  try {
    const { postId, userId, content, createdAt } = req.body;

    if (!postId || !userId || !content || !createdAt) {
      return res.status(400).json({
        success: false,
        message: "All fields (postId, userId, content, createdAt) are required",
      });
    }

    // Check if this post already exists in Search DB
    const existing = await Search.findOne({ postId });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Post already exists in search database",
      });
    }

    // Create a new search document
    const searchPost = await Search.create({
      postId,
      userId,
      content,
      createdAt,
    });

    return res.status(201).json({
      success: true,
      message: "Search post stored successfully",
      data: searchPost,
    });
  } catch (error) {
    logger.error("Error creating search post", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


module.exports = { searchPostController,createSearchPost };
