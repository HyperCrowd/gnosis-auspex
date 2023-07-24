import type { GameConfig } from './index.d';
import { VIEWPORT_HEIGHT, VIEWPORT_WIDTH } from './config';
import { GameScene } from './scenes';
import { ExampleScene } from './scenes/example';
import City from './city'

export const gameConfig: GameConfig = {
  title: 'Gnosis',
  width: VIEWPORT_WIDTH, // || window.innerWidth,
  height: VIEWPORT_HEIGHT, // || window.innerHeight,
  mode: Phaser.Scale.NONE,
  parent: 'viewport',
  type: Phaser.WEBGL,
  scene: [ExampleScene],
  physics: {
    default: 'arcade',
    arcade: {
      // gravity: { y: 2000 },
      debug: false,
    },
  },
  backgroundColor: '#000033',
  pixelArt: true,
  roundPixels: false,
  antialias: false,
  initialCity: 'first',
  startX: 0,
  startY: 0
};

export class GnosisGame extends Phaser.Game {
  onReady: () => Promise<void>;
  cities: City[]
  currentScene: Phaser.Scene

  /**
   *
   */
  constructor(config: GameConfig = gameConfig, onReady: () => Promise<void>) {
    super(config)
    this.onReady = onReady
    this.events.once('ready', this.onReady, this)
  }

  /**
   * Called by: ./index.ts (onLoad)
   */
  startEngine () {
    return new Promise(async (resolve) => {
      this.events.once('ready', async () => {
        // Build initial scene
        const scene = this.getScene(ExampleScene.key || config.initialCity)
        this.currentScene = scene

        // Start city
        const initialCity = new City(scene, {
          city: {
            length: 500,
            height: 100
          },
          buildings: {
            minHeight: 100,
            maxHeight: 120,
            minWidth: 15,
            maxWidth: 20,
            minDistance: 0,
            maxDistance: 6,
            averageRoomPopulation: 4
          },
          subway: {
            height: 6,
            onrampDistance: 160,
          },
          fov: {
            width: this.config.width,
            height: this.config.height,
            x: this.config.startX,
            y: this.config.startY
          }
        })

        // Build the city
        // @TODO: probably have to do this async and with a progress bar eventually
        initialCity.generate()

        this.cities = [initialCity]

        // @TODO bring these into City
        const layer = scene.addLayer('test');
        const container = scene.addContainer('box', 'test', 0, 0)

        // Allow for dynamic window resizing
        window.addEventListener('resize', () => this.resizeGameCanvas())
        this.resizeGameCanvas()

        this.canvas.getContext('2d', { willReadFrequently: true })

        // Run custom functions
        await this.onReady()

        // Start the game
        resolve(this)
      }, this);
    })
  }

  /**
   * 
   */
  resizeGameCanvas () {
    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight

    this.config.width = `${windowWidth}px`
    this.config.height = `${windowHeight}px`

    this.scale.resize(windowWidth, windowHeight)
  }


  /**
   *
   */
  getScene(sceneKey: string) {
    return this.scene.getScene(sceneKey) as GameScene
  }
}
