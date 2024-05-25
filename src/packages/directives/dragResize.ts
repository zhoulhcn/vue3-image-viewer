import { DirectiveBinding } from 'vue';

const props = {
  minSize: -Infinity,
  maxSize: Infinity,
  disabled: false,
  enabled: true,
};
const borderSize = 2;
let activeMarkers: Array<any> = [];
let anchorClicked = false;
let moveTimer: any = null;
class singleton {
  constructor() {
    // console.log('constructor');
  }
  init(MARKER: any) {
    if (MARKER.initialized) {
      // 只有第一次激活时添加anchor dom
      // console.log('aready initialized anchor');
      return;
    } else {
      return this.addAnchors(MARKER);
    }
  }
  addAnchors(MARKER: any) {
    const anchorKeys = Object.keys(anchorMap);
    // 生成anchor的DOM
    const anchors = anchorKeys.map((key) => {
      const anchor = generateAnchor(key);
      // 记录方位的字段
      anchor.key = key;
      return anchor;
    });
    for (const anchor of anchors) {
      addEventForAnchor(anchor);
      // 追加anchor
      MARKER.appendChild(anchor);
    }
    MARKER.initialized = true;
    return anchors;
  }
}
const anchorAdder = new singleton();
let wrapperDom: any = null;
let activeMarker: any = null;
// 记录鼠标信息的对象
const touch = { startX: 0, startY: 0, target: null, started: false };
const anchorSize = 5;
const anchorColor = 'DeepPink';
const moveIcon = 'icondrag1';
const moveSize = 10;
const halfs = anchorSize / 2;
// 单例模式-激活编辑模式才会生成对应的anchor
// 锚点参数定义
const anchorMap: any = {
  lt: {
    dirX: -1,
    dirY: -1,
    fixed: 1,
    style: {
      left: `-${borderSize}px`,
      top: `-${borderSize}px`,
      cursor: `se-resize`,
      zIndex: 50,
    },
  },
  mt: {
    dirX: 0,
    dirY: -1,
    fixed: 1,
    style: {
      left: `50%`,
      transform: `translateX(-${halfs}px)`,
      top: `-${borderSize}px`,
      cursor: `s-resize`,
      zIndex: 50,
    },
  },
  rt: {
    dirX: 1,
    dirY: -1,
    fixed: 1,
    style: {
      right: `-${borderSize}px`,
      top: `-${borderSize}px`,
      cursor: `sw-resize`,
      zIndex: 50,
    },
  },
  lm: {
    dirX: -1,
    dirY: 0,
    fixed: 1,
    style: {
      left: `-${borderSize}px`,
      top: `50%`,
      transform: `translateY(-${halfs}px)`,
      cursor: `e-resize`,
      zIndex: 50,
    },
  },
  rm: {
    dirX: 1,
    dirY: 0,
    fixed: 1,
    style: {
      right: `-${borderSize}px`,
      top: `50%`,
      transform: `translateY(-${halfs}px)`,
      cursor: `w-resize`,
      zIndex: 50,
    },
  },
  lb: {
    dirX: -1,
    dirY: 1,
    fixed: 1,
    style: {
      left: `-${borderSize}px`,
      bottom: `-${borderSize}px`,
      cursor: `ne-resize`,
      zIndex: 50,
    },
  },
  mb: {
    dirX: 0,
    dirY: 1,
    fixed: 1,
    style: {
      left: `50%`,
      transform: `translateX(-${halfs}px)`,
      bottom: `-${borderSize}px`,
      cursor: `n-resize`,
      zIndex: 50,
    },
  },
  rb: {
    dirX: 1,
    dirY: 1,
    fixed: 1,
    style: {
      right: `-${borderSize}px`,
      bottom: `-${borderSize}px`,
      cursor: `nw-resize`,
      zIndex: 50,
    },
  },
  mm: {
    dirX: -1,
    dirY: -1,
    fixed: 0,
    style: {
      left: `50%`,
      top: `50%`,
      transform: `translate(-${moveSize / 2}px,-${moveSize / 2}px)`,
      cursor: `move`,
      zIndex: 50,
      backgroundColor: anchorColor,
      borderRadius: '1px',
    },
  },
};

// border的参数定义
const borders = [
  // left
  {
    height: '100%',
    width: `${borderSize}px`,
    left: `-${borderSize}px`,
    top: 0,
    bottom: 0,
  },
  // right
  {
    height: '100%',
    width: `${borderSize}px`,
    right: `-${borderSize}px`,
    top: 0,
    bottom: 0,
  },
  // top
  {
    width: '100%',
    height: `${borderSize}px`,
    left: 0,
    top: `-${borderSize}px`,
    right: 0,
  },
  {
    width: '100%',
    height: `${borderSize}px`,
    left: 0,
    bottom: `-${borderSize}px`,
    right: 0,
  },
];
const disabledColor = 'gray';

function unRegister(MARKER: any) {
  const borders = MARKER.querySelectorAll('.v3iv-drag-border');
  for (const border of borders) {
    MARKER.initialized = false;
    removeEventForBorder(border);
    MARKER.removeChild(border);
  }
  const anchors = MARKER.querySelectorAll('.v3iv-drag-anchor');
  for (const anchor of anchors) {
    removeEventForAnchor(anchor);
    MARKER.removeChild(anchor);
  }
}

// 退出时移除anchor重新添加border
function exitResize() {
  clearMoveTimer();
  if (!activeMarkers.length) {
    return;
  }
  if (anchorClicked) {
    anchorClicked = false;
    return;
  }
  activeMarkers = activeMarkers.filter((MARKER) => {
    addBorder(MARKER);
    const anchors = MARKER.querySelectorAll('.v3iv-drag-anchor');
    // 移除anchor
    for (const anchor of anchors) {
      removeEventForAnchor(anchor);
      MARKER.removeChild(anchor);
    }
    const deleteBtn = MARKER.querySelector('.v3iv-mark-delete');
    if (deleteBtn) {
      deleteBtn.style.display = 'block';
    }
    return false;
  });
}

function addBorder(MARKER: any) {
  const borderDoms = [];
  // 生成dom节点
  for (const item of borders) {
    const { width, height, left, right, top, bottom } = item;
    const borderDom: any = document.createElement('DIV');
    borderDom.style.width = width;
    borderDom.style.height = height;
    // borderDom.style.backgroundColor = 'red';
    borderDom.style.opacity = 0.5;
    borderDom.style.position = 'absolute';
    borderDom.style.cursor = 'move';
    borderDom.style.userSelect = 'none';
    borderDom.style.touchAction = 'none';
    borderDom.style.pointerEvents = 'auto';
    borderDom.classList.add('v3iv-drag-border');
    if (left !== undefined) {
      borderDom.style.left = left;
    }
    if (right !== undefined) {
      borderDom.style.right = right;
    }
    if (top !== undefined) {
      borderDom.style.top = top;
    }
    if (bottom !== undefined) {
      borderDom.style.bottom = bottom;
    }
    borderDoms.push(borderDom);
  }

  for (const borderDom of borderDoms) {
    // 点击激活编辑-单边的dom
    addEventForBorder(borderDom);
    MARKER.appendChild(borderDom);
  }
}

function addEventBeforeResize() {
  if (!wrapperDom) {
    return;
  }
  wrapperDom.addEventListener('mousewheel', stopEvent);
  wrapperDom.addEventListener('click', stopEvent);
  document.addEventListener('mousemove', mousemove_, { passive: false });
  document.addEventListener('mouseup', mouseup_);
}

function removeEventAfterResize() {
  if (!wrapperDom) {
    return;
  }
  wrapperDom.removeEventListener('mousewheel', stopEvent);
  wrapperDom.removeEventListener('click', stopEvent);
  document.removeEventListener('mousemove', mousemove_);
  document.removeEventListener('mouseup', mouseup_);
}

function addEventForAnchor(anchor: HTMLElement) {
  // anchor上阻止滚动缩放
  anchor.addEventListener('mousewheel', stopEvent);
  anchor.addEventListener('mousedown', stopEvent);
  anchor.addEventListener('mousedown', onAnchorDown);
}

function removeEventForAnchor(anchor: HTMLElement) {
  anchor.removeEventListener('mousewheel', stopEvent);
  anchor.removeEventListener('mousedown', stopEvent);
  anchor.removeEventListener('mousedown', onAnchorDown);
}

function addEventForBorder(border: HTMLElement) {
  border.addEventListener('click', startResize);
  // border.addEventListener('click', stopEvent);
  // border上阻止滚动缩放
  border.addEventListener('mousewheel', stopEvent);
  border.addEventListener('mousedown', stopEvent);
}

function removeEventForBorder(border: HTMLElement) {
  border.removeEventListener('click', startResize);
  // border.removeEventListener('click', stopEvent);
  border.removeEventListener('mousewheel', stopEvent);
  border.removeEventListener('mousedown', stopEvent);
}

function startResize(ev: any) {
  ev.stopPropagation();
  ev.preventDefault();
  const MARKER = ev.target.parentNode;
  // 激活时添加anchor，但不会重复添加
  anchorAdder.init(MARKER);
  // 激活后borders就没用了-移除
  const borders = MARKER.querySelectorAll('.v3iv-drag-border');
  for (const border of borders) {
    MARKER.initialized = false;
    removeEventForBorder(border);
    MARKER.removeChild(border);
  }
  // 不阻止事件传递，主要是右键点击
  const deleteBtn = MARKER.querySelector('.v3iv-mark-delete');
  if (deleteBtn) {
    deleteBtn.style.display = 'none';
  }
  activeMarkers.push(MARKER);
}

function stopEvent(ev: any) {
  ev.stopPropagation();
  ev.preventDefault();
}

function onAnchorDown(ev: any) {
  const { which } = ev;
  if (which != 1) {
    return;
  }
  ev.stopPropagation();
  ev.preventDefault();
  const anchor = ev.target;
  const MARKER = anchor.parentNode;
  const event = new CustomEvent('resize-start');
  MARKER.dispatchEvent(event);
  wrapperDom = MARKER.parentNode;
  // 调节大小拖拽时禁止缩放
  addEventBeforeResize();
  // 此处有问题，没有到达
  // console.log(props.disabled);
  // // 表示disabled
  // const { disabled } = props;
  // if (disabled) {
  //   return;
  // }
  ev.preventDefault();
  ev.stopPropagation();
  // 此处是一个闭包
  // 同一时间只会有一个激活的marker
  if (activeMarker) {
    activeMarker.style.zIndex = 30;
  }
  // 激活的marker有更高的层级
  activeMarker = MARKER;
  activeMarker.style.zIndex = 40;
  // 记录鼠标起点坐标和所操作的对象
  touch.started = true;

  touch.target = anchor;
  touch.startX = ev.pageX;
  touch.startY = ev.pageY;
}

// 没有做防抖和节流
function mousemove_(ev: any) {
  // 节流
  if (moveTimer) {
    return;
  }
  moveTimer = setTimeout(() => {
    if (!touch.started) {
      clearMoveTimer();
      return;
    }
    ev.preventDefault();
    ev.stopPropagation();
    // 从操作对象中获取key拿到anchor信息
    const { key } = touch.target as any;
    const { dirX, dirY } = anchorMap[key];
    const moveX = dirX * (ev.pageX - touch.startX);
    const moveY = dirY * (ev.pageY - touch.startY);
    const lb = ['lt', 'lm', 'lb'];
    const tb = ['lt', 'mt', 'rt'];
    const rb = ['rt', 'rm', 'rb'];
    const bb = ['lb', 'mb', 'rb'];
    let left = 0;
    let top = 0;
    let right = 0;
    let bottom = 0;
    if (lb.includes(key)) {
      left = -moveX;
    }
    if (tb.includes(key)) {
      top = -moveY;
    }
    if (rb.includes(key)) {
      right = moveX;
    }
    if (bb.includes(key)) {
      bottom = moveY;
    }
    if (key === 'mm') {
      left = -moveX;
      right = -moveX;
      top = -moveY;
      bottom = -moveY;
    }
    const event = new CustomEvent('resize-move', {
      detail: {
        left,
        top,
        right,
        bottom,
        key,
      },
    });
    activeMarker.dispatchEvent(event);
    clearMoveTimer();
  }, 20);
}

function clearMoveTimer() {
  if (moveTimer) {
    clearTimeout(moveTimer);
    moveTimer = null;
  }
}

// 处理改变窗口大小的后续
function mouseup_(ev: MouseEvent) {
  ev.preventDefault();
  ev.stopPropagation();
  if (!touch.started) return;
  clearMoveTimer();
  touch.started = false;
  touch.target = null;
  anchorClicked = true;
  const event = new CustomEvent('resize-end');
  activeMarker.dispatchEvent(event);
  // 此时已经移除mouse事件，激活后重新激活
  removeEventAfterResize();
  wrapperDom = null;
}

function generateAnchor(key: string) {
  const { style, fixed } = anchorMap[key];
  const anchorDom: any = document.createElement('DIV');
  anchorDom.style.height = `${anchorSize}px`;
  anchorDom.style.width = `${anchorSize}px`;
  anchorDom.style.backgroundColor = anchorColor;
  anchorDom.style.position = 'absolute';
  anchorDom.style.userSelect = 'none';
  anchorDom.style.touchAction = 'none';
  anchorDom.style.pointerEvents = 'auto';
  anchorDom.classList.add('v3iv-drag-anchor');
  if (!fixed) {
    anchorDom.classList.add('zlhiconfont', moveIcon);
    anchorDom.style.height = `${moveSize}px`;
    anchorDom.style.width = `${moveSize}px`;
    anchorDom.style.fontSize = `${moveSize}px`;
    anchorDom.style.color = anchorColor;
    anchorDom.style.backgroundColor = 'transparent';
  }
  // 复制style到dom上
  for (const key of Object.keys(style)) {
    const value = style[key];
    anchorDom.style[key] = value;
  }
  return anchorDom;
}

// 监听disabled参数来显隐border和anchor
// 画图时屏蔽anchor和border防止中断
function setStatus(node: any, disabled: boolean) {
  if (disabled) {
    node.style.pointerEvents = 'none';
    node.style.backgroundColor =
      node.style.backgroundColor == anchorColor && disabledColor;
    node.style.color = node.style.color == anchorColor && disabledColor;
    node.style.display = 'none';
  } else {
    node.style.pointerEvents = 'auto';
    node.style.backgroundColor =
      node.style.backgroundColor == disabledColor && anchorColor;
    node.style.color = node.style.color == disabledColor && anchorColor;
    node.style.display = 'block';
  }
}

// 解析传参
function parseProps(binding: DirectiveBinding) {
  const value = binding.value || {};
  const {
    // 当前缩放倍数和限制缩放大小
    maxSize = props.maxSize,
    minSize = props.minSize,
    disabled = props.disabled,
    enabled = props.enabled,
  } = value;
  props.maxSize = maxSize;
  props.minSize = minSize;
  props.disabled = disabled;
  props.enabled = enabled;
}

export default {
  mounted(el: Element, binding: DirectiveBinding) {
    // exitResize();
    if (el) {
      // 解析传参
      parseProps(binding);
      const { enabled } = props;
      if (!enabled) {
        return;
      }
      const MARKER = el;
      // 添加border
      addBorder(MARKER);
      // 退出编辑状态
      document.addEventListener('click', exitResize);
    }
  },
  // 移除document的事件
  unmounted(el: Element, binding: DirectiveBinding) {
    exitResize();
    unRegister(el);
    document.removeEventListener('click', exitResize);
  },
  updated(el: Element, binding: DirectiveBinding) {
    // 解析传参
    parseProps(binding);
    const { disabled, enabled } = props;
    if (!enabled) {
      return;
    }
    const anchors: any = el.querySelectorAll('.v3iv-drag-anchor');
    const borders: any = el.querySelectorAll('.v3iv-drag-border');
    for (const node of anchors) {
      setStatus(node, disabled);
    }
    for (const node of borders) {
      setStatus(node, disabled);
    }
  },
};