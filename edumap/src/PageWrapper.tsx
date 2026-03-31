interface PageWrapperChildren{
    children: React.ReactNode;
}

function PageWrapper({ children }: PageWrapperChildren) {
  return (
    <div className={`relative w-screen h-screen overflow-hidden`}>
        {children}
    </div>
  )
}

export default PageWrapper