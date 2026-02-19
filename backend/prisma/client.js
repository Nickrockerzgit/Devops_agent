// src/prisma/client.js   (naya file bana)
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

module.exports = prisma;