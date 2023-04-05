// https://github.com/facebook/create-react-app/tree/main/packages/react-app-polyfill
// organize-imports-ignore
import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import { init } from '@noriginmedia/norigin-spatial-navigation';
import App from 'App';
import ReactDOM from 'react-dom/client';

init({
    debug: true,
    visualDebug: false,
    useGetBoundingClientRect: false,
    // throttle: 500,
    // throttleKeypresses: true,
});

// Replace with your own keymap for example webos and tizen
// setKeyMap({
//   'left': 9001,
//   'up': 9002,
//   'right': 9003,
//   'down': 9004,
//   'enter': 9005
// });

const root: ReactDOM.Root = ReactDOM.createRoot(document.getElementById('root')!);
// NOTE: DO NOT use React.StrictMode
// StrictMode renders components twice (on dev but not production) in order to
// detect any problems with your code and warn you about them (which can be quite useful).
// However it messed up with the navigation logic due to the fact that it renders twice.
root.render(<App />);
