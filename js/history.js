import useScroll from 'scroll-behavior/lib/useStandardScroll';
import { browserHistory } from 'react-router';

const history = useScroll(() => {
    return browserHistory;
})();

export default history;
