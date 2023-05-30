

import { pool } from "../db.js";

export const addRender = (req, res) => res.render('links/add');

export const addLink = async (req, res) => {
  const {title, url, description } = req.body
  const newLink = {
    title,
    url,
    description,
    user_id: req.user.id
  }
  await pool.query('INSERT INTO links set ?', [newLink])
  console.log(newLink)
  req.flash('success', 'Link agregado correctamente')
  res.redirect('/links')
};

export const getAllLinks = async (req, res) => {
  const linksResult = await pool.query('SELECT * FROM links WHERE user_id = ? ', [req.user.id]);
  const links = linksResult[0];

  res.render('links/list', { links: links });
};

export const deleteLink = async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM links WHERE ID = ?', [id]);
  req.flash('success', 'Link Removed Successfully');
  res.redirect('/links');
}

export const editLink = async (req, res) => {
  const { id } = req.params;
  const linkResult = await pool.query('SELECT * FROM links WHERE id = ?', [id]);
  const link = linkResult[0][0]; // Acceder al nivel correcto del array anidado

  res.render('links/edit', { link: link });
};

export const updateLink = async(req, res) => {
  const { id } = req.params;
  const { title, description, url} = req.body; 
  const newLink = {
      title,
      description,
      url
  };
  await pool.query('UPDATE links set ? WHERE id = ?', [newLink, id]);
  req.flash('success', 'Link Updated Successfully');
  res.redirect('/links');
}