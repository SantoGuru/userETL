const multer = require("multer");
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const supabase = require("../config/db");

const upload = multer({ dest: "uploads/" });

const uploadFunc = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).send("Nenhum arquivo foi enviado.");
    }

    const results = [];
    const filePath = path.join(__dirname, "..", file.path);
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", async () => {
        try {
          for (const row of results) {
            const { first_name, last_name, email, data_nascimento } = row;
            const nome = `${first_name} ${last_name}`;
            const { error } = await supabase.from("usuario").upsert([
              {
                nome,
                email,
                data_nascimento,
              },
            ]);

            if (error) {
              console.error("Erro ao inserir no Supabase:", error);
              return res
                .status(500)
                .send(
                  `Erro ao salvar os dados no banco para o email ${email}.`
                );
            }
          }

          fs.unlinkSync(filePath);

          res.status(200).send("Dados enviados com sucesso!");
        } catch (err) {
          console.error("Erro ao processar o arquivo:", err);
          res.status(500).send("Erro ao processar o arquivo.");
        }
      });
  } catch (err) {
    console.error(err);
    res.status(500).send("Erro interno do servidor.");
  }
};

module.exports = { uploadFunc, upload };