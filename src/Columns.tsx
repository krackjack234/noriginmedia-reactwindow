import { FocusContext, useFocusable } from '@noriginmedia/norigin-spatial-navigation';
import Cell from 'Cell';
import { useEffect, useRef, useState } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList } from 'react-window';
import { useAnimatedList } from 'use-AnimatedList';
import classes from './App.module.scss';
import './styles.css';

const BASE_URL = 'https://jsonplaceholder.typicode.com/photos';
const PAGE_SIZE = 20;
const IS_ANIMATION_ENABLED = false;

const Columns: React.VFC = () => {
    const itemsRef = useRef<any[]>([]);
    const listRef = useRef<any>(null);

    const currentIndexRef = useRef<number>(0);
    const [dataSize, setDataSize] = useState<number>(0);

    const { scrollToItem } = useAnimatedList(listRef.current, 100);

    const isDataUpdatePendingRef = useRef<boolean>(false);
    const pageNoRef = useRef<number>(1);
    const startIndexRef = useRef<number>(2000);

    const { ref, focusKey, focusSelf, setFocus } = useFocusable({
        focusKey: 'Column',
        trackChildren: true,
        autoRestoreFocus: true,
    });

    const fetchData = () => {
        isDataUpdatePendingRef.current = true;
        fetch(`${BASE_URL}?_start=${startIndexRef.current}&_limit=${PAGE_SIZE}`)
            .then((response) => response.json())
            .then((data) => {
                //Step 1: push new data to the beginning of the array
                itemsRef?.current ? itemsRef.current.unshift(...data) : itemsRef.current.push(...data);

                //Step 2: calculate new index
                console.log('old index: ', currentIndexRef.current);
                currentIndexRef.current = currentIndexRef.current + (data.length - 1);
                pageNoRef.current++;
                console.log('new index: ', currentIndexRef.current);

                //Step 3: re-render new list
                setDataSize(itemsRef.current.length);
            });
    };

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        //Set 4: set focus to last focused cell and scroll to that cell
        const id = itemsRef.current[currentIndexRef.current]?.id;
        itemsRef?.current.length && setFocus('Cell-' + id);

        IS_ANIMATION_ENABLED
            ? scrollToItem(currentIndexRef.current, true)
            : listRef?.current?.scrollToItem(currentIndexRef.current);

        console.log('scroll to index: ', currentIndexRef.current, 'focused: ', 'Cell-' + id);

        isDataUpdatePendingRef.current = false;
    }, [dataSize]);

    function onCellFocus(args: any) {
        if (!isDataUpdatePendingRef.current) {
            currentIndexRef.current = args[1]?.index; //update current index
            console.log('focused index: ', currentIndexRef.current, ' text: ', args[0]?.node?.innerText);

            IS_ANIMATION_ENABLED
                ? scrollToItem(currentIndexRef.current, true)
                : listRef?.current?.scrollToItem(currentIndexRef.current);

            //fetch new set of data
            if (currentIndexRef.current <= 2) {
                startIndexRef.current = startIndexRef.current - PAGE_SIZE;
                fetchData();
            }
        }
    }

    useEffect(() => {
        focusSelf();
    }, [focusSelf]);

    return (
        <FocusContext.Provider value={focusKey}>
            <div ref={ref}>
                <div style={{ height: '50px' }}>
                    <AutoSizer>
                        {({ height, width }) => (
                            <FixedSizeList
                                className={classes['fixed-list']}
                                ref={listRef}
                                height={height}
                                itemCount={itemsRef?.current.length}
                                itemSize={100}
                                width={width}
                                layout="horizontal">
                                {({ index, style }) => {
                                    return (
                                        <Cell
                                            key={index}
                                            style={style}
                                            items={itemsRef.current}
                                            index={index}
                                            callBack={onCellFocus}
                                        />
                                    );
                                }}
                            </FixedSizeList>
                        )}
                    </AutoSizer>
                </div>
            </div>
        </FocusContext.Provider>
    );
};

export default Columns;
