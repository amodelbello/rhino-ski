import jumpRamp from '../assets/jump_ramp.png';
import rhinoDefault from '../assets/rhino_default.png';
import rhinoLift from '../assets/rhino_lift.png';
import rhinoLiftEat1 from '../assets/rhino_lift_eat_1.png';
import rhinoLiftEat2 from '../assets/rhino_lift_eat_2.png';
import rhinoLiftEat3 from '../assets/rhino_lift_eat_3.png';
import rhinoLiftEat4 from '../assets/rhino_lift_eat_4.png';
import rhinoLiftMouthOpen from '../assets/rhino_lift_mouth_open.png';
import rhinoRunLeft from '../assets/rhino_run_left.png';
import rhinoRunLeft2 from '../assets/rhino_run_left_2.png';
import rock1 from '../assets/rock_1.png';
import rock2 from '../assets/rock_2.png';
import skierCrash from '../assets/skier_crash.png';
import skierDown from '../assets/skier_down.png';
import skierJump1 from '../assets/skier_jump_1.png';
import skierJump2 from '../assets/skier_jump_2.png';
import skierJump3 from '../assets/skier_jump_3.png';
import skierJump4 from '../assets/skier_jump_4.png';
import skierJump5 from '../assets/skier_jump_5.png';
import skierLeft from '../assets/skier_left.png';
import skierLeftDown from '../assets/skier_left_down.png';
import skierRight from '../assets/skier_right.png';
import skierRightDown from '../assets/skier_right_down.png';
import tree1 from '../assets/tree_1.png';
import treeCluster from '../assets/tree_cluster.png';

const paths = [
  { jumpRamp },
  { rhinoDefault },
  { rhinoLift },
  { rhinoLiftEat1 },
  { rhinoLiftEat2 },
  { rhinoLiftEat3 },
  { rhinoLiftEat4 },
  { rhinoLiftMouthOpen },
  { rhinoRunLeft },
  { rhinoRunLeft2 },
  { rock1 },
  { rock2 },
  { skierCrash },
  { skierDown },
  { skierJump1 },
  { skierJump2 },
  { skierJump3 },
  { skierJump4 },
  { skierJump5 },
  { skierLeft },
  { skierLeftDown },
  { skierRight },
  { skierRightDown },
  { tree1 },
  { treeCluster },
];

const assetPromises: Promise<{}>[] = [];
const assets: any = {};

paths.forEach(path => {
  const keys = Object.keys(path);
  const value: string = Object.values(path).toString();

  const image = new Image();
  image.src = value;
  const imagePromise = new Promise(resolve => {
    image.onload = () => {
      image.width /= 2;
      image.height /= 2;
      resolve();
    };
  });
  assetPromises.push(imagePromise);
  assets[keys[0]] = image;
});

export { assets, assetPromises };
