import React from 'react';
import './less/icon.less';


export default ({glyph, className = 'icon', width = 1, height = 1}) => (
    <svg className={className} width={width} height={height}>
        {/* 如果 svg sprite extract 选项为 false，使用  */}
        <use xlinkHref={'#' + glyph.id} />
        {/* 否则，使用 */}
        {/* <use xlinkHref={glyph} /> */}
    </svg>
);
