const getPackages = (packageFor) => {
    switch (packageFor) {
        case 'ts':
            return {
                dev: ['typescript'],
                normal: ['ts-node'],
            };
        case 'react-ts':
            return {
                normal: ['react', 'react-dom'],
                dev: [
                    '@types/react',
                    '@types/react-dom',
                    '@typescript-eslint/eslint-plugin',
                    '@typescript-eslint/parser',
                    'awesome-typescript-loader',
                    'css-loader',
                    'eslint',
                    'eslint-react',
                    'html-webpack-plugin',
                    'mini-css-extract-plugin',
                    'optimize-css-assets-webpack-plugin',
                    'sass',
                    'sass-loader',
                    'source-map-loader',
                    'terser-webpack-plugin',
                    'webpack',
                    'webpack-cli',
                ],
            };
    }
};

module.exports = {
    getPackages,
};
