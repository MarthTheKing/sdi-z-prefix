/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('users').del()
  await knex('users').insert([
    {firstname:'billy',lastname:'bob',username:'billybob1234',password:'pretend this is some hashed text'},
    {firstname:'larry',lastname:'lowe',username:'xX_shadoLORD_Xx',password:'im not writing out fake hashes'},
    {firstname:'ron',lastname:'swanson',username:'ronswanson',password:'ronswansonexcepthashed'}
  ]);
};
