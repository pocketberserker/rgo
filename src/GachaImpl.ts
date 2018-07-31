"use strict";
import * as core from "@cowlick/core";
import {Servant, servants} from "./Servant";
import {Box, Lot} from "./Lot";

const top = "gacha";
const once = "tutorial";

export interface Result {
  servant: Servant;
  target: core.Jump;
}

interface GachaParameterObject {
  game: g.Game;
  label: string;
  lots: Lot[];
  servants: Servant[];
  moveTo: core.Jump;
}

const black = (opacity: number): core.Image => ({
  tag: core.Tag.image,
  assetId: "black",
  layer: {
    name: "black",
    opacity
  }
});

export class Gacha {
  private label: string;
  private lots: Lot[];
  private servants: Servant[];
  scene: core.Scene;
  // サーヴァントとframe番号のマッピング
  private mapper: Map<string, number>;

  constructor(param: GachaParameterObject) {
    this.label = param.label;
    this.lots = param.lots;
    this.servants = param.servants;
    this.mapper = new Map<string, number>();

    const layer = "character";
    const frames = [
      new core.Frame([
        {
          tag: core.Tag.trigger,
          value: core.TriggerValue.Off
        },
        {
          tag: core.Tag.layer,
          name: "message",
          visible: false
        },
        {
          tag: core.Tag.removeLayer,
          name: layer
        },
        {
          tag: core.Tag.removeLayer,
          name: "black"
        },
        {
          tag: core.Tag.image,
          assetId: "greeting",
          layer: {name: "background"}
        },
        {
          tag: core.Tag.image,
          assetId: param.label + "Top",
          layer: {name: "gacha"}
        },
        {
          tag: core.Tag.link,
          layer: {
            name: "button",
            x: param.game.width / 2 - 75,
            y: 500
          },
          width: 180,
          height: 50,
          text: "1回召喚",
          fontSize: 32,
          backgroundImage: "yellow",
          padding: 4,
          backgroundEffector: {
            borderWidth: 4
          },
          scripts: [
            {
              tag: core.Tag.fadeIn,
              layer: "black",
              duration: 200,
              after: []
            }
          ]
        },
        black(1),
        {
          tag: core.Tag.extension,
          data: {
            tag: "enterScene"
          }
        }
      ]),
      new core.Frame([
        {
          tag: core.Tag.extension,
          data: {
            tag: param.label === once ? "drawLotForTutorial" : "drawLot"
          }
        }
      ])
    ];
    const move = new core.Frame([param.moveTo]);
    if (param.label === once) {
      move.scripts.unshift(
        {
          tag: core.Tag.evaluate,
          path: "markTutorial"
        },
        {
          tag: core.Tag.extension,
          data: {
            tag: "defaultUI"
          }
        }
      );
    }
    for (const servant of servants) {
      this.mapper.set(servant.id, frames.length);
      const x = 370;
      frames.push(
        new core.Frame([
          {
            tag: core.Tag.trigger,
            value: core.TriggerValue.Off
          },
          {
            tag: core.Tag.removeLayer,
            name: "button"
          },
          {
            tag: core.Tag.removeLayer,
            name: "gacha"
          },
          {
            tag: core.Tag.image,
            assetId: "greeting",
            layer: {name: "background"}
          },
          black(1),
          {
            tag: core.Tag.fadeOut,
            layer: "black",
            duration: 1000,
            after: []
          }
        ]),
        new core.Frame([
          {
            tag: core.Tag.image,
            assetId: servant.assetId,
            layer: {
              name: layer,
              x,
              opacity: 0
            }
          },
          {
            tag: core.Tag.fadeIn,
            layer,
            duration: 1000,
            after: []
          }
        ]),
        new core.Frame([
          // fade in終了前にスキップした場合、fade in終了時のskipが発火しないようにlayerごとTimelineを削除
          {
            tag: core.Tag.removeLayer,
            name: layer
          },
          {
            tag: core.Tag.image,
            assetId: servant.assetId,
            layer: {
              name: layer,
              x
            }
          },
          {
            tag: core.Tag.removeLayer,
            name: "choice"
          },
          {
            tag: core.Tag.text,
            clear: true,
            values: servant.greeting
          },
          {
            tag: core.Tag.timeout,
            milliseconds: 16,
            scripts: [
              {
                tag: core.Tag.layer,
                name: "message",
                visible: true
              }
            ]
          }
        ]),
        new core.Frame([
          {
            tag: core.Tag.trigger,
            value: core.TriggerValue.Off
          },
          black(0),
          {
            tag: core.Tag.fadeIn,
            layer: "black",
            duration: 200,
            after: []
          }
        ]),
        move
      );
    }

    this.scene = new core.Scene({
      label: param.label,
      frames
    });
  }

  draw(index: number): Result {
    const id = this.lots[index].draw();
    const servant = this.servants.find(s => s.id === id);
    return {
      servant,
      target: {
        tag: core.Tag.jump,
        label: this.label,
        frame: this.mapper.get(servant.id)
      }
    };
  }
}

const load = (assetId: string) => {
  return (g.game.assets[assetId] as g.TextAsset).data;
};

const boxes = JSON.parse(load("boxes")) as Box[];
const lots = (JSON.parse(load("lots")) as any[]).map(l => new Lot(boxes.find(b => b.id === l.boxId), servants));
export const gacha = new Gacha({
  game: g.game,
  label: top,
  lots: lots.slice(1),
  servants,
  moveTo: {
    tag: core.Tag.jump,
    label: top
  }
});
export const tutorial = new Gacha({
  game: g.game,
  label: once,
  lots: [lots[0]],
  servants,
  moveTo: {
    tag: core.Tag.jump,
    label: "first"
  }
});
