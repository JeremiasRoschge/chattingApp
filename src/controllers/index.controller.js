import express from "express";
import { pool } from "../db.js";

export const index = (req, res) => {
  res.render('index');
};


export const profile = async (req, res) => {
  res.render('profile');
};
