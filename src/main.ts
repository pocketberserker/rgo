"use strict";
import * as tl from "@akashic-extension/akashic-timeline";
import * as core from "@cowlick/core";
import {MessageWindowConfig} from "@cowlick/config";
import * as novel from "@cowlick/engine";
import {gacha, tutorial, Gacha} from "./GachaImpl";
import {Engine} from "@cowlick/engine";

const addLoadingScene = (game: g.Game) => {
  const loading = new g.LoadingScene({
    //explicitEnd: true,
    game: g.game
  });
  loading.loaded.add(() => {
    const black = new g.Sprite({
      scene: loading,
      src: g.game.assets.black as g.ImageAsset,
      x: 0,
      y: 0
    });
    loading.append(black);
    const four = new g.FrameSprite({
      scene: loading,
      src: g.game.assets.loading as g.ImageAsset,
      width: 280,
      height: 80,
      x: g.game.width - 280,
      y: g.game.height - 80,
      interval: 500
    });
    four.frames = [0, 1, 2, 3];
    four.start();
    loading.append(four);
    const line = new g.FilledRect({
      scene: loading,
      width: g.game.width,
      height: 3,
      y: g.game.height - 11,
      cssColor: "white"
    });
    loading.append(line);

    loading.modified();
  });
  g.game.loadingScene = loading;
};

let defaultUI: MessageWindowConfig;
const gachaUI: MessageWindowConfig = {
  ui: {
    layer: {
      name: core.LayerKind.message,
      x: 0,
      y: 0
    },
    width: g.game.width,
    height: g.game.height,
    touchable: true,
    backgroundImage: "gachaBackground"
  },
  top: {
    x: 70,
    y: 530
  },
  marker: []
};

const drawGacha = (controller: novel.SceneController, gacha: Gacha) => {
  // TODO: ガチャの決め打ちをやめる
  const result = gacha.draw(0);
  controller.current.gameState.variables.system.servants.push(result.servant.id);
  controller.jump(result.target);
};

const addScripts = (engine: novel.Engine) => {
  engine.script("gacha", (controller: novel.SceneController, data: {}) => {
    controller.config.window.message = gachaUI;
    controller.jump({
      tag: core.Tag.jump,
      label: "gacha"
    });
  });
  engine.script("tutorialgacha", (controller: novel.SceneController, data: {}) => {
    controller.config.window.message = gachaUI;
    controller.jump({
      tag: core.Tag.jump,
      label: "tutorial"
    });
  });
  engine.script("drawLot", (controller: novel.SceneController, data: {}) => {
    drawGacha(controller, gacha);
  });
  engine.script("drawLotForTutorial", (controller: novel.SceneController, data: {}) => {
    drawGacha(controller, tutorial);
  });
  const fadeInScript = novel.defaultScripts.get(core.Tag.fadeIn);
  engine.script(core.Tag.fadeIn, (controller: novel.SceneController, data: any) => {
    data.after = [
      {
        tag: core.Tag.skip
      }
    ];
    fadeInScript(controller, data);
  });
  const fadeOutScript = novel.defaultScripts.get(core.Tag.fadeOut);
  engine.script(core.Tag.fadeOut, (controller: novel.SceneController, data: any) => {
    data.after = [
      {
        tag: core.Tag.skip
      }
    ];
    fadeOutScript(controller, data);
  });
  engine.script("marker", (controller: novel.SceneController, text: core.Text) => {
    const name = "marker";
    const scene = controller.current;
    const image = new g.Sprite({
      scene,
      // TODO: globalでないロードに変える
      src: g.game.assets["marker"] as g.ImageAsset
    });
    scene.appendLayer(image, {name});
    scene.transition(name, (layer: g.E) => {
      let timeline = new tl.Timeline(scene);
      timeline
        .create(layer, {loop: true, modified: layer.modified, destroyed: layer.destroyed})
        .moveTo(0, 10, 300, tl.Easing.easeInOutCirc)
        .moveTo(0, 0, 300, tl.Easing.easeInOutCirc);
    });
    scene.pointUpCapture.addOnce(() => {
      if (scene.destroyed() === false) {
        scene.removeLayer(name);
      }
    }, scene);
  });
  engine.script("limit", (controller: novel.SceneController, text: core.Text) => {
    Engine.scriptManager.call(controller, {
      tag: core.Tag.evaluate,
      path: "limit"
    });
  });
  engine.script("warning", (controller: novel.SceneController, data: {}) => {
    const scene = controller.current;
    const duration = 700;
    scene.disableWindowClick();
    scene.transition("warning", (layer: g.E) => {
      const timeline = new tl.Timeline(scene);
      timeline
        .create(layer, {modified: layer.modified, destroyed: layer.destroyed})
        .fadeIn(duration)
        .fadeOut(duration)
        .fadeIn(duration)
        .fadeOut(duration)
        .call(() => scene.requestNextFrame());
    });
  });
  engine.script("enterScene", (controller: novel.SceneController, data: {}) => {
    const scene = controller.current;
    const duration = 700;
    scene.disableWindowClick();
    scene.transition("black", (layer: g.E) => {
      const timeline = new tl.Timeline(scene);
      timeline.create(layer, {modified: layer.modified, destroyed: layer.destroyed}).fadeOut(duration);
    });
  });
  engine.script(core.Tag.load, (controller: novel.SceneController, data: {}) => {
    const state = controller.current.gameState;
    // 初回起動なら空データを保存
    if (state.exists(0) === false) {
      state.variables.system.servants = [];
      return;
    }
    if (state.variables.system.tutorial) {
      controller.jump({
        tag: core.Tag.jump,
        label: "first"
      });
    } else if (state.variables.system.first) {
      controller.jump({
        tag: core.Tag.jump,
        label: "gacha"
      });
    }
  });
  engine.script("defaultUI", (controller: novel.SceneController, data: {}) => {
    controller.config.window.message = defaultUI;
  });
};

module.exports = (param: g.GameMainParameterObject) => {
  addLoadingScene(g.game);

  const engine = novel.initialize(g.game);
  defaultUI = engine.config.window.message;
  if (param.snapshot) {
    require("snapshotLoader")(param.snapshot);
  } else {
    addScripts(engine);

    let controller = engine.load("prologue");

    g.game.snapshotRequest.add(() => {
      if (g.game.shouldSaveSnapshot()) {
        g.game.saveSnapshot(controller.snapshot());
      }
    });
  }
};
