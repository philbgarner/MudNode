const Component = require('./component')

class Forest extends Component {
    constructor (params) {
        super(params)

        this.type = 'forest'

        this.props.trees = [{name: 'Pine', qty: 200}, {name: 'Oak', qty: 1000}]
    }

    Description() {
        let treeCount = this.props.trees.map(t => t.qty).reduce((a, b) => a + b)
        let size = 'sparse'
        if (treeCount > 1000) {
            size = 'huge'
        } else if (treeCount > 500) {
            size = 'dense'
        } else if (treeCount > 250) {
            size = 'large'
        } else if (treeCount > 100) {
            size = 'big'
        } else if (treeCount > 50) {
            size = 'small'
        }
        this.props.trees.sort((a, b) => a.size - b.size)
        let treelist = this.props.trees.map(t => t.name)
        let tlist = ''
        for (let t = 0; t < treelist.length - 1; t++) {
            tlist += treelist[t] + ', '
        }
        tlist = tlist.substring(0, tlist.length - 2) + ' and ' + treelist[treelist.length - 1] + '.'
        return `There is a ${size} forest here, made up of ${tlist}`
    }

    Update () {
        this._update()
    }
}

module.exports = Forest