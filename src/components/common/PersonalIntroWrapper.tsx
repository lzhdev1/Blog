import { getAboutData } from '@/lib/about'
import { PersonalIntro } from '@/components/common/PersonalIntro'

export function PersonalIntroWrapper() {
  const about = getAboutData()

  if (!about) {
    return <div className="p-6 text-gray-500">未找到个人简介数据</div>
  }

  return <PersonalIntro about={about} />
}
