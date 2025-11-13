const { knex } = require("../../db/db");

module.exports = async (r, h) => {


  try {
    const members = await knex('galette_adherents')
      .join('galette_statuts', 'galette_adherents.id_statut', 'galette_statuts.id_statut')
      .whereIn('galette_adherents.id_statut', [1, 2, 3, 4]) // President, Treasurer, Secrétaire, Membre actif
      .where(function () {
        this.where('galette_adherents.date_echeance', '>', new Date())
          .orWhere('galette_adherents.bool_exempt_adh', true);
      })
      .select('galette_adherents.*', 'galette_statuts.libelle_statut as statut_nom');

    console.log(members.length);
    return h.response(members);
  } catch (error) {
    return h.response({ error }).code(500);
  }
}