export enum Direction {
  Crash = 0,
  North = 1,
  West = 2,
  SouthWest = 3,
  South = 4,
  SouthEast = 5,
  East = 6,
}

export enum ObstacleType {
  Tree = 'tree',
  TreeCluster = 'treeCluster',
  Rock1 = 'rock1',
  Rock2 = 'rock2',
  Ramp = 'jumpRamp',
}

export enum ValidControl {
  Null = -1,
  Up = 38,
  W = 87,
  Right = 39,
  D = 68,
  Down = 40,
  S = 83,
  Left = 37,
  A = 65,
  P = 80,
  Space = 32,
  Esc = 27,
}

export enum GameStatus {
  Unstarted = 0,
  Skiing = 2,
  Dead = 3,
  Over = 4,
}

export enum GameAction {
  MoveUp = 0,
  MoveLeft = 1,
  MoveDown = 2,
  MoveRight = 3,
  Pause = 4,
  SpeedBoost = 5,
  NormalSpeed = 6,
}

export enum JumpStage {
  One = 'skierJump1',
  Two = 'skierJump2',
  Three = 'skierJump3',
  Four = 'skierJump4',
  Five = 'skierJump5',
}

export enum EatStage {
  One = 'rhinoLift',
  Two = 'rhinoLiftMouthOpen',
  Three = 'rhinoLiftEat1',
  Four = 'rhinoLiftEat2',
  Five = 'rhinoLiftEat3',
  Six = 'rhinoLiftEat4',
}

export enum ControlMethod {
  Null = 'null',
  KeyDown = 'keydown',
  KeyUp = 'keyup',
}
