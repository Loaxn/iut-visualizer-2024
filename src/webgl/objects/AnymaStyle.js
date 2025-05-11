import * as THREE from "three";
import audioController from "../../utils/AudioController"; // adapte le chemin si nécessaire

export default class AnymaStyle {
  constructor() {
    this.group = new THREE.Group();
    this.count = 0;

    // Matériaux de base
    const skin = new THREE.MeshBasicMaterial({ color: 0xffc0cb }); // rose clair
    const green = new THREE.MeshBasicMaterial({ color: 0x00ff99 }); // vert techno

    // Parties du corps
    this.head = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), skin);
    this.head.position.y = 4.5;
    this.group.add(this.head);

    this.body = new THREE.Mesh(new THREE.BoxGeometry(1.5, 2, 0.5), green);
    this.body.position.y = 3;
    this.group.add(this.body);

    this.armL = new THREE.Mesh(new THREE.BoxGeometry(0.4, 1.5, 0.4), green.clone());
    this.armL.position.set(-1.1, 3.2, 0);
    this.group.add(this.armL);

    this.armR = new THREE.Mesh(new THREE.BoxGeometry(0.4, 1.5, 0.4), green.clone());
    this.armR.position.set(1.1, 3.2, 0);
    this.group.add(this.armR);

    this.legL = new THREE.Mesh(new THREE.BoxGeometry(0.5, 2, 0.5), skin.clone());
    this.legL.position.set(-0.4, 1, 0);
    this.group.add(this.legL);

    this.legR = new THREE.Mesh(new THREE.BoxGeometry(0.5, 2, 0.5), skin.clone());
    this.legR.position.set(0.4, 1, 0);
    this.group.add(this.legR);

    this.group.position.y = 0.1;

    // Sauvegarder les positions d'origine pour restaurer après "explosion"
    this.originalPositions = {
      head: this.head.position.clone(),
      body: this.body.position.clone(),
      armL: this.armL.position.clone(),
      armR: this.armR.position.clone(),
      legL: this.legL.position.clone(),
      legR: this.legR.position.clone(),
    };
  }

  explodePart(part) {
    part.position.x += (Math.random() - 0.5) * 0.3;
    part.position.y += (Math.random() - 0.5) * 0.3;
    part.position.z += (Math.random() - 0.5) * 0.3;

    const scale = 1 + Math.random() * 0.3;
    part.scale.setScalar(scale);

    part.material.color.setRGB(Math.random(), Math.random(), Math.random());
  }

  restorePart(part, originalPos) {
    part.position.lerp(originalPos, 0.1);
    part.scale.lerp(new THREE.Vector3(1, 1, 1), 0.1);
  }

  update(time, deltaTime) {
    if (audioController.bpm) {
      this.count += deltaTime * 0.001;

      if (this.count > 60 / audioController.bpm) {
        this.explodePart(this.head);
        this.explodePart(this.armL);
        this.explodePart(this.armR);
        this.explodePart(this.legL);
        this.explodePart(this.legR);

        this.count = 0;
      } else {
        this.restorePart(this.head, this.originalPositions.head);
        this.restorePart(this.armL, this.originalPositions.armL);
        this.restorePart(this.armR, this.originalPositions.armR);
        this.restorePart(this.legL, this.originalPositions.legL);
        this.restorePart(this.legR, this.originalPositions.legR);
      }
    }
  }
}
