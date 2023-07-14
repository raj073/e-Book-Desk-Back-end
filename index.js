const express = require("express");
const { mongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");

require("dotenv").config();

const port = process.env.PORT || 5000;
