// Tùy chọn header dùng chung cho mọi Native Stack: nền đỏ, chữ trắng, căn giữa
import colors from '../theme/colors';

export default {
  headerStyle: { backgroundColor: colors.primary },
  headerTintColor: colors.white,
  headerTitleAlign: 'center',
  headerTitleStyle: { fontWeight: '700' },
  headerShadowVisible: false,
};
