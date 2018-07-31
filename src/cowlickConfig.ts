"use strict";
import * as core from "@cowlick/core";
import {Config} from "@cowlick/config";

const size = 32;

const glyph = JSON.parse((g.game.assets["glyph"] as g.TextAsset).data);
const font = new g.BitmapFont({
  src: g.game.assets["font"],
  map: glyph.map,
  defaultGlyphWidth: glyph.width,
  defaultGlyphHeight: glyph.height,
  missingGlyph: glyph.missingGlyph
});

const config: Config = {
  window: {
    message: {
      ui: {
        layer: {
          name: core.LayerKind.message,
          x: 0,
          y: 0
        },
        width: g.game.width,
        height: g.game.height,
        touchable: true,
        backgroundImage: "message"
      },
      top: {
        x: 70,
        y: 550
      },
      marker: [
        {
          tag: core.Tag.extension,
          data: {
            tag: "marker"
          }
        }
      ]
    },
    system: [
      {
        tag: core.Tag.button,
        image: {
          tag: core.Tag.image,
          assetId: "blank",
          layer: {
            name: core.LayerKind.system
          },
          frame: {
            width: 44,
            height: 32,
            scale: 1,
            frames: [0, 1, 2]
          }
        },
        x: 1205,
        y: 550,
        scripts: [
          {
            tag: core.Tag.backlog,
            scripts: [
              {
                tag: core.Tag.pane,
                layer: {
                  name: core.LayerKind.backlog,
                  opacity: 100,
                  x: 10,
                  y: 10
                },
                width: g.game.width - 20,
                height: g.game.height - 20,
                backgroundImage: "blank",
                padding: 4,
                backgroundEffector: {
                  borderWidth: 4
                },
                touchable: true
              }
            ]
          }
        ]
      },
      {
        tag: core.Tag.button,
        image: {
          tag: core.Tag.image,
          assetId: "blank",
          layer: {
            name: core.LayerKind.system
          },
          frame: {
            width: 44,
            height: 32,
            scale: 1,
            frames: [0, 1, 2]
          }
        },
        x: 1205,
        y: 600,
        scripts: [
          {
            tag: core.Tag.autoMode
          }
        ]
      }
    ]
  },
  font: {
    list: [
      font,
      new g.DynamicFont({
        game: g.game,
        fontFamily: g.FontFamily.SansSerif,
        size
      })
    ],
    color: "white",
    alreadyReadColor: "white",
    size
  },
  system: {
    maxSaveCount: 100,
    messageSpeed: 1000 / g.game.fps,
    autoMessageDuration: 1500,
    alreadyRead: false,
    realTimeDisplay: false
  },
  audio: {
    voice: 0.5,
    se: 0.5,
    bgm: 0.5
  }
};

module.exports = config;
