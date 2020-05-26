const debounceEvent = () => {
    
    var time = null;
    /**
     * fn ()=> void
     * wait number default 1000 
     */
    return (fn, wait = 1000) => {
        
        clearTimeout(time);

        time = setTimeout(()=>{
            fn();
        }, wait);
    };
};

export default debounceEvent;