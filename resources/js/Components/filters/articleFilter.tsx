export function convertGenre(genre: number) {
  switch (genre) {
    case 0:
      return '備忘録';
    case 1:
      return '読書まとめ';
    case 2:
      return '便利記事系';
    case 3:
      return 'ポエム';
    default:
      return 'その他';
  }
}

export function makeGenreColor(genre: number) {
  switch (genre) {
    case 0:
      return '#2e7d32';
    case 1:
      return '#0055ff';
    case 2:
      return '#d32f2f';
    case 3:
      return '#9c27b0';
    default:
      return '#2e7d32';
  }
}
