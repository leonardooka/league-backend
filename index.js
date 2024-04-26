const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const morgan = require("morgan")

app.use(morgan('dev'));
app.use(cors({
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Acess denied by CORS'));
    }
  }
}));

app.use(cors({
  origin: 'https://leaguesimulator.netlify.app/',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.get("/", async (req, res) => {
  try {
    const allLeagues = await pool.query("SELECT * FROM leagues");
    return res.json(allLeagues.rows);
  } catch (error) {
    console.error(error.message);
  }
});

app.get("/leagues/:leagueId", async (req, res) => {
  try {
    const { leagueId } = req.params;
    const league = await pool.query(
      `SELECT * FROM leagues WHERE league_id = ${leagueId}`
    );
    res.json(league.rows[0]);
  } catch (error) {
    console.error(error.message);
  }
});

app.get("/teams", async (req, res) => {
  try {
    const allTeams = await pool.query("SELECT * FROM teams");
    res.json(allTeams.rows);
  } catch (error) {
    console.error(error.message);
  }
});

app.get("/players", async (req, res) => {
  try {
    const allPlayers = await pool.query("SELECT * FROM players");
    res.json(allPlayers.rows);
  } catch (error) {
    console.error(error.message);
  }
});

app.post("/add-league", async (req, res) => {
  try {
    const { name, teams, standings, matches } = req.body;
    const newLeague = await pool.query(
      "INSERT INTO leagues (name, teams, standings, matches) VALUES($1, $2, $3, $4) RETURNING *",
      [name, teams, standings, matches]
    );
    console.log("league added", name);
    res.json(newLeague.rows[0]);
  } catch (error) {
    console.error(error.message);
  }
});

app.post('/add-team', async (req, res) => {
  try {
    console.log(JSON.stringify(req.body))
    const { name, logo, tag, country_tag} = req.body;
    const newTeam = await pool.query('INSERT INTO teams (name, logo, tag, country_tag) VALUES($1, $2, $3, $4) RETURNING *', [name, logo, tag, country_tag])
    console.log('team added', name);
    res.json(newTeam.rows[0]);
  } catch (error) {
    console.error(error.message)
  }
})


app.post("/add-player", async (req, res) => {
  try {
    const { name, position, country_tag, team } = req.body;
    const newPlayer = await pool.query(
      "INSERT INTO players (name, position, country_tag, team) VALUES($1, $2, $3, $4) RETURNING *",
      [name, position, country_tag, team]
    );
    console.log("player added", name);
    res.json(newPlayer.rows[0]);
  } catch (error) {
    console.error(error.message);
  }
});

app.patch("/edit-league/:leagueId", async (req, res) => {
  try {
    const { leagueId } = req.params;
    const { standings, matches } = req.body;

    const updateLeague = await pool.query(
      "UPDATE leagues SET standings = $1, matches = $2 WHERE league_id = $3",
      [standings, matches, leagueId]
    );
    console.log("league edited", leagueId);
    res.status(200).send("League updated");
  } catch (error) {
    console.error(error.message);
  }
});

app.patch("/edit-player/:playerId", async (req, res) => {
  try {
    const { playerId } = req.params;
    const { goals, assists } = req.body;

    const updatePlayer = await pool.query(
      "UPDATE players SET goals = $1, assists = $2 WHERE player_id = $3",
      [goals, assists, playerId]
    );
    console.log("player edited", playerId);
    res.status(200).send("Player updated");
  } catch (error) {
    console.error(error.message);
  }
});

app.delete("/delete-league", async (req, res) => {
  try {
    const { league_id } = req.body;
    const deleteLeague = await pool.query(
      "DELETE FROM leagues WHERE league_id = $1",
      [league_id]
    );
    console.log("league deleted", league_id);
  } catch (error) {
    console.error(error.message);
  }
});

const PORT = process.env.PORT || 3001;

app.listen(Number(PORT), () => {
  console.log("server has started on port 5001");
});
