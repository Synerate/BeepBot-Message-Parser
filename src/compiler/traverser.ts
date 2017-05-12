import { IAst } from './parser';

export function traverser(ast: IAst, visitor) {
    function traverseArray(array: IAst[], parent: IAst) {
        array.forEach(child => traverseNode(child, parent));
    }

    function traverseNode(node, parent) {
        const methods = visitor[node.type];

        if (methods && methods.enter) {
            methods.enter(node, parent);
        }

        switch (node.type) {
            case 'Program':
                traverseArray(node.body, node);
                break;
            case 'Method':
                traverseArray(node.params, node);
                break;
            case 'String':
                break;
            default:
                throw new TypeError(node.type);
        }
    }

    traverseNode(ast, null);
}
