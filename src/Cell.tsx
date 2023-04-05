import { useFocusable } from '@noriginmedia/norigin-spatial-navigation';
import classes from './App.module.scss';

const Cell: React.VFC<{ style: any; items: any; index: number; callBack: any }> = (props) => {
    const { ref, focused } = useFocusable({
        focusKey: 'Cell-' + props.items[props.index].id,
        onFocus: (...args) => {
            props.callBack(args);
        },
        extraProps: {
            index: props.index,
            focusKey: 'Cell-' + props.index,
        },
    });

    return (
        <div ref={ref} className={`${focused ? classes.focused : ''}`} style={props.style}>
            Ep {props.items[props.index].id + ' '}
        </div>
    );
};

export default Cell;
