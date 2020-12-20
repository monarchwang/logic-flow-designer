import React from "react";
import {Graph, Edge, Shape, NodeView} from "@antv/x6";

//高亮
const magnetAvailabilityHighlighter = {
  name: 'stroke',
  args: {
    attrs: {fill: '#fff', stroke: '#47C769'},
  }
}


export default class FlowDesigner extends React.Component<any, any> {

  constructor(props: any) {
    super(props);
    this.state = {
      data: buildData(),
      graph: null
    }
  }


  componentDidMount() {
    // const graph = new Graph({
    //   container: document.getElementById("container") || undefined,
    //   width: 800,
    //   height: 600,
    //   background: {
    //     color: '#fffbe6', // 设置画布背景颜色
    //   },
    //   grid: {
    //     size: 10,      // 网格大小 10px
    //     visible: true, // 渲染网格背景
    //   },
    // })
    // graph.fromJSON(this.state.data)

    const graph = init();

    this.setState({graph})
  }

  render() {
    return <div>
      <div id="container"/>
    </div>;
  }
}


class MyShape extends Shape.Rect {

  getInPorts() {
    return this.getPortsByGroup("in");
  }

  getOutPorts() {
    return this.getPortsByGroup("out");
  }

  getUsedInPorts(graph: Graph) {
    const incomingEdges = graph.getIncomingEdges(this) || [];
    return incomingEdges.map((edge: Edge) => {
      const portId = edge.getTargetPortId()
      return this.getPort(portId!)
    })
  }

  getNewInPorts(length: number) {
    return Array.from({length}, () => ({group: "in"}))
  }

  updateInPorts(graph: Graph) {
    const minNumberOfPorts = 2;
    const ports = this.getInPorts();
    const usedPorts = this.getUsedInPorts(graph);
    const newPorts = this.getNewInPorts(Math.max(minNumberOfPorts - usedPorts.length, 1))
    let inPortsNum = ports.length;
    if (inPortsNum === minNumberOfPorts && inPortsNum - usedPorts.length > 0) {
      // noop
    } else if (inPortsNum === usedPorts.length) {
      this.addPort(newPorts)
    } else if (inPortsNum + 1 > usedPorts.length) {
      this.prop(
        ['ports', 'items'],
        this.getOutPorts().concat(usedPorts).concat(newPorts),
        {rewrite: true});
    }

    return this;
  }

}

MyShape.config({
  attrs: {
    root: {magnet: false},
    body: {fill: '#f5f5f5', stroke: '#d9d9d9', strokeWidth: 1}
  },
  ports: {
    items: [{group: 'out'}],
    groups: {
      in: {
        position: {name: 'top'},
        attrs: {
          portBody: {
            magnet: 'passive', r: 6, stroke: '#ffa940', fill: '#fff', strokeWidth: 2
          }
        }
      },

      out: {
        position: {name: 'bottom'},
        attrs: {
          portBody: {
            magnet: true, r: 6, fill: '#fff', stroke: '#3199FF', strokeWidth: 2,
          },
        }
      }

    }
  },

  portMarkup: [
    {tagName: 'circle', selector: 'portBody'}
  ]
})


//画布初始化
function init() {
  const graph = new Graph({
    width: 800,
    height: 600,
    grid: {
      size: 10,      // 网格大小 10px
      visible: true, // 渲染网格背景
    },
    container: document.getElementById('container')!,
    highlighting: {
      magnetAvailable: magnetAvailabilityHighlighter,
      magnetAdsorbed: {
        name: 'stroke',
        args: {
          attrs: {fill: '#fff', stroke: '#31d0c6'},
        }
      }
    },

    connecting: {
      snap: true,
      dangling: false,
      highlight: true,
      connector: 'rounded',
      connectionPoint: 'boundary',
      router: {name: 'er', args: {direction: 'V'}},
      createEdge: args => new Shape.Edge({
        attrs: {
          lines: {stroke: '#a0a0a0', strokeWidth: 1, targetMarker: {name: 'classic', size: 7}}
        }
      }),

      validateConnection({sourceView, targetView, targetMagnet}) {
        if (!targetMagnet) {
          return false
        }

        if (sourceView === targetView) {
          return false
        }
        if (targetMagnet.getAttribute("port-group") !== 'in') {
          return false
        }
        if (targetView) {
          const node = targetView.cell
          if (node instanceof MyShape) {
            const portId = targetMagnet.getAttribute("port")
            const usedInPorts = node.getUsedInPorts(graph);
            if (usedInPorts.find(port => port!.id === portId)) {
              return false;
            }
          }
        }

        return true;
      },
    }
  })


  graph.addNode(
    new MyShape().resize(120, 40).position(200, 50).updateInPorts(graph),
  )

  graph.addNode(
    new MyShape().resize(120, 40).position(400, 50).updateInPorts(graph),
  )

  graph.addNode(
    new MyShape().resize(120, 40).position(300, 250).updateInPorts(graph),
  )

  const update = (view: NodeView) => {
    const cell = view.cell
    if (cell instanceof MyShape) {
      cell.getInPorts().forEach(port => {
        const portNode = view.findPortElem(port.id!, 'portBody')
        view.unhighlight(portNode, {highlighter: magnetAvailabilityHighlighter})
      })
      cell.updateInPorts(graph)
    }
  }

  graph.on('edge:connected', ({previousView, currentView}) => {
    if (previousView) {
      update(previousView as NodeView)
    }
    if (currentView) {
      update(currentView as NodeView)
    }
  })

  graph.on('edge:removed', ({edge, options}) => {
    if (!options.ui) {
      return
    }

    const target = edge.getTargetCell()
    if (target instanceof MyShape) {
      target.updateInPorts(graph)
    }
  })

  graph.on("edge:mouseenter", ({edge}) => {
    edge.addTools([
      'source-arrowhead',
      'target-arrowhead',
      {
        name: 'button-remove',
        args: {
          distance: -30,
        },
      },
    ])
  })

  graph.on('edge:mouseleave', ({edge}) => {
    edge.removeTools()
  })
  return graph;
}


/**
 * 构建数据
 */
function buildData() {
  return {
    // 节点
    nodes: [
      {
        id: 'node1', // String，可选，节点的唯一标识
        x: 40,       // Number，必选，节点位置的 x 值
        y: 40,       // Number，必选，节点位置的 y 值
        width: 80,   // Number，可选，节点大小的 width 值
        height: 40,  // Number，可选，节点大小的 height 值
        label: 'hello', // String，节点标签
      },
      {
        id: 'node2', // String，节点的唯一标识
        x: 160,      // Number，必选，节点位置的 x 值
        y: 180,      // Number，必选，节点位置的 y 值
        width: 80,   // Number，可选，节点大小的 width 值
        height: 40,  // Number，可选，节点大小的 height 值
        label: 'world', // String，节点标签
      },
    ],
    // 边
    edges: [
      {
        source: 'node1', // String，必须，起始节点 id
        target: 'node2', // String，必须，目标节点 id
      },
    ],
  }
}