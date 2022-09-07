const Jimp = require("jimp");
const fs = require("fs");

async function textOverlay(text, n) {
  // Reading image
  const image = await Jimp.read("inp.jpg");
  await image.resize(550, 550);

  // Defining the text font
  const font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
  const font2 = await Jimp.loadFont(Jimp.FONT_SANS_16_WHITE);
  image.print(
    font,
    0,
    0,
    {
      text: text,
      alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
      alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
    },
    540,
    540
  );
  image.print(
    font2,
    -20,
    -20,
    {
      text: `That's What She Said #${n}`,
      alignmentX: Jimp.HORIZONTAL_ALIGN_RIGHT,
      alignmentY: Jimp.VERTICAL_ALIGN_BOTTOM,
    },
    550,
    550
  );
  // Writing image after processing
  await image.writeAsync(`imgs/${n}.png`);

  const meta = {
    name: `That's What She Said #${n}`,
    symbol: "TWSS",
    description: "That's What She Said",
    seller_fee_basis_points: 1000,
    image: `${n}.png`,
    external_url: "",
    edition: 0,
    attributes: [
      {
        trait_type: "Background",
        value: "Black",
      },
      {
        trait_type: "Text",
        value: text,
      },
    ],
    properties: {
      files: [
        {
          uri: `${n}.png`,
          type: "image/png",
        },
      ],
      category: "image",
      creators: [
        {
          address: "ESs5sfxnV82fvwWu3mdGR8tN7XVyiseoGAEsK35cNKC8",
          share: 100,
        },
      ],
    },
  };

  const metaString = JSON.stringify(meta);
  await fs.open(`meta/${n}.json`, "wx", (err, fd) => {
    if (err) throw err;
    fs.writeFile(fd, metaString, (err) => {
      if (err) throw err;
    });
  });
  console.log(`#${n} done`);
}

const text = fs.readFileSync("lines.txt", "utf8");
const lines = text.split("\n");
for (let i = 0; i < 69; i++) {
  textOverlay(lines[i], i);
}
