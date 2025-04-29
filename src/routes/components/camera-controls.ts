import CC from 'camera-controls';
import type { PerspectiveCamera, OrthographicCamera } from 'three';
import {
	Box3,
	Matrix4,
	Quaternion,
	Raycaster,
	Sphere,
	Spherical,
	Vector2,
	Vector3,
	Vector4
} from 'three';

export type Camera = OrthographicCamera | PerspectiveCamera;

export default class CameraControls extends CC {
	static #installed = false;
	constructor(element: HTMLElement, camera: Camera) {
		if (!CameraControls.#installed) {
			CC.install({
				THREE: {
					Box3,
					Matrix4,
					Quaternion,
					Raycaster,
					Sphere,
					Spherical,
					Vector2,
					Vector3,
					Vector4
				}
			});
			CameraControls.#installed = true;
		}
		super(camera, element);
	}
}
