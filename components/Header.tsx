'use client'
import React, { useState } from 'react'
import { useResizeObserver } from '@react-hookz/web'
import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import Logo from '@/data/logo.svg'
import Link from './Link'
import MobileNav from './MobileNav'
import ThemeSwitch from './ThemeSwitch'
import SearchButton from './SearchButton'
import { cn, twx } from '../lib/utils'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion'

const Header = () => {
  const [visible, setVisible] = useState(true)
  const { scrollYProgress } = useScroll()
  const borderBgClass = `z-50 mx-auto hidden max-w-fit items-center justify-center rounded-full border border-transparent bg-white/70 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] backdrop-blur-sm  sm:flex dark:border-white/[0.2] dark:bg-black/70`
  useMotionValueEvent(scrollYProgress, 'change', (current) => {
    // 页面无滚动条时则永远显示
    if (document.documentElement.scrollHeight <= window.innerHeight) {
      setVisible(true)
      return
    }
    const direction = current - scrollYProgress.getPrevious()
    if (scrollYProgress.get() < 0.05) {
      setVisible(true)
    } else {
      // 兼容页面加载时 current 为 1
      if (direction <= 0) {
        setVisible(true)
      } else {
        setVisible(false)
      }
    }
  })
  // 手动调整窗口大小时，如果页面无滚动条则显示
  // 三元表达式解决控制台报错 ReferenceError: window is not defined
  useResizeObserver(typeof window !== 'undefined' ? window.document.body : null, () => {
    if (document.documentElement.scrollHeight <= window.innerHeight) {
      setVisible(true)
    }
  })

  let headerClass = 'flex items-center w-full bg-white dark:bg-gray-950 justify-between py-10'
  if (siteMetadata.stickyNav) {
    headerClass += ' sticky top-0 z-50'
  }

  return (
    <header className={headerClass}>
      <Link
        className={cn('left-6 top-10 px-2 py-2 md:fixed ')}
        href="/"
        aria-label={siteMetadata.headerTitle}
      >
        <div className="flex items-center justify-between">
          {/* <div className="mr-3">
            <Logo />
          </div> */}
          {typeof siteMetadata.headerTitle === 'string' ? (
            <div className="hidden h-5 text-2xl font-semibold sm:block">
              {siteMetadata.headerTitle}
            </div>
          ) : (
            siteMetadata.headerTitle
          )}
        </div>
      </Link>
      <div className="flex items-center space-x-4 leading-5 sm:space-x-6">
        <AnimatePresence mode="wait">
          <motion.div
            initial={{
              opacity: 0.5,
              y: 0,
            }}
            animate={{
              y: visible ? 0 : -100,
              opacity: visible ? 1 : 0,
            }}
            transition={{
              duration: 0.4,
            }}
            className={cn('fixed inset-x-0 top-10 z-50 space-x-4 px-8  py-2', borderBgClass)}
          >
            {headerNavLinks.map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className="block font-medium text-gray-900 hover:text-primary-500 dark:text-gray-100 dark:hover:text-primary-400"
              >
                {link.title}
              </Link>
            ))}
          </motion.div>
          <motion.div
            initial={{
              opacity: 0.5,
              x: 0,
            }}
            animate={{
              x: visible ? 0 : 100,
              opacity: visible ? 1 : 0,
            }}
            transition={{
              duration: 0.4,
            }}
            className={cn(`pointer fixed right-6 top-10 space-x-2 px-2 py-2`, borderBgClass)}
          >
            <SearchButton />
            <ThemeSwitch />
          </motion.div>
        </AnimatePresence>

        <MobileNav />
      </div>
    </header>
  )
}

export default Header
